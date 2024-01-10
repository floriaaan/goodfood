package services

import (
	"context"
	"errors"
	"goodfood-user/pkg/db"
	"goodfood-user/pkg/mapper"
	"goodfood-user/pkg/models"
	"goodfood-user/pkg/utils"
	pb "goodfood-user/proto"
	"google.golang.org/grpc/status"
	"gorm.io/gorm"
	"time"
)

type Server struct {
	pb.UnimplementedUserServiceServer
	H   db.Handler
	Jwt utils.JwtWrapper
}

func (s *Server) Register(_ context.Context, req *pb.UserCreateInput) (*pb.UserOutput, error) {
	logger := utils.GetLogger()
	var role models.Role

	result := s.H.DB.Where(&models.User{Email: req.Email}).First(&models.User{})

	if !errors.Is(result.Error, gorm.ErrRecordNotFound) {
		logger.Fatalf("User already exists: %v", result.Error)
		return &pb.UserOutput{}, status.Error(409, "User already exists")
	}

	s.H.DB.Where(&models.Role{Code: req.Role.Code}).First(&role)

	user := mapper.InputToModelUser(req)
	user.Email = req.Email
	user.Password = utils.HashPassword(req.Password)
	user.RoleId = role.Id

	s.H.DB.Create(&user)

	return &pb.UserOutput{
		User: mapper.ToProtoUser(user),
	}, nil
}

func (s *Server) LogIn(_ context.Context, req *pb.LogInInput) (*pb.LogInResponse, error) {
	logger := utils.GetLogger()
	var user models.User

	if result := s.H.DB.Where(&models.User{Email: req.Email}).Preload("Role").Preload("MainAddress").First(&user); result.Error != nil {
		logger.Fatalf("User not found: %v", result.Error)
		return &pb.LogInResponse{}, status.Error(401, "Invalid credentials")
	}

	user.Email = req.Email
	if !utils.CheckPasswordHash(req.Password, user.Password) {
		logger.Fatalf("Invalid credentials")
		return &pb.LogInResponse{}, status.Error(401, "Invalid credentials")
	}

	token, _ := s.Jwt.GenerateToken(user)

	return &pb.LogInResponse{User: mapper.ToProtoUser(&user), Token: token}, nil
}

func (s *Server) Validate(_ context.Context, req *pb.ValidateInput) (*pb.ValidateResponse, error) {
	logger := utils.GetLogger()
	token, err := s.Jwt.ParseToken(req.Token)

	if err != nil {
		logger.Fatalf("Invalid credentials: %v", err)
		return &pb.ValidateResponse{}, status.Error(401, "Invalid credentials")
	}

	claims, ok := token.Claims.(*utils.JwtClaims)

	if !ok {
		logger.Fatalf("Couldn't parse claims")
		return nil, status.Error(401, "Couldn't parse claims")
	}

	if claims.ExpiresAt < time.Now().Local().Add(-time.Hour*1).Unix() {
		logger.Fatalf("JWT is expired")
		return nil, status.Error(401, "JWT is expired")
	}

	return &pb.ValidateResponse{
		Id: claims.Id,
	}, nil
}
