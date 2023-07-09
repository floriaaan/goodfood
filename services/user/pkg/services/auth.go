package services

import (
	"context"
	"errors"
	"goodfood-user/pkg/db"
	"goodfood-user/pkg/mapper"
	"goodfood-user/pkg/models"
	"goodfood-user/pkg/utils"
	pb "goodfood-user/proto"
	"time"
)

type Server struct {
	pb.UnimplementedUserServiceServer
	H   db.Handler
	Jwt utils.JwtWrapper
}

func (s *Server) Register(_ context.Context, req *pb.UserCreateInput) (*pb.UserOutput, error) {
	var role models.Role

	result := s.H.DB.Where(&models.User{Email: req.Email}).First(&models.User{})

	if result.RowsAffected > 0 {
		return &pb.UserOutput{
			Error: "User already exists",
		}, nil
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
	var user models.User

	if result := s.H.DB.Where(&models.User{Email: req.Email}).Preload("Role").Preload("MainAddress").First(&user); result.Error != nil {
		return &pb.LogInResponse{Error: "Invalid credentials"}, nil
	}

	user.Email = req.Email
	if !utils.CheckPasswordHash(req.Password, user.Password) {
		return &pb.LogInResponse{Error: "Invalid credentials"}, nil
	}

	token, _ := s.Jwt.GenerateToken(user)

	return &pb.LogInResponse{User: mapper.ToProtoUser(&user), Token: token}, nil
}

func (s *Server) Validate(_ context.Context, req *pb.ValidateInput) (*pb.ValidateResponse, error) {
	token, err := s.Jwt.ParseToken(req.Token)

	if err != nil {
		return &pb.ValidateResponse{
			Error: err.Error(),
		}, nil
	}

	claims, ok := token.Claims.(*utils.JwtClaims)

	if !ok {
		return nil, errors.New("couldn't parse claims")
	}

	if claims.ExpiresAt < time.Now().Local().Add(-time.Hour*1).Unix() {
		return nil, errors.New("JWT is expired")
	}

	return &pb.ValidateResponse{
		UserId: claims.Id,
	}, nil
}
