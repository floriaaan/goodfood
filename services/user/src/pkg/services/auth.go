package services

import (
	"context"
	"goodfood-user/pkg/db"
	"goodfood-user/pkg/mapper"
	"goodfood-user/pkg/models"
	"goodfood-user/pkg/utils"
	pb "goodfood-user/proto"
)

type Server struct {
	pb.UnimplementedUserServiceServer
	H   db.Handler
	Jwt utils.JwtWrapper
}

func (s *Server) Register(_ context.Context, req *pb.UserCreateInput) (*pb.UserOutput, error) {
	var role models.Role

	if result := s.H.DB.Where(&models.User{Email: req.Email}).First(models.User{}); result.RowsAffected > 0 {
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

	if result := s.H.DB.Where(&models.User{Email: req.Email}).First(&user); result.Error != nil {
		return nil, result.Error
	}

	user.Email = req.Email
	if !utils.CheckPasswordHash(req.Password, user.Password) {
		return nil, nil
	}

	token, _ := s.Jwt.GenerateToken(user)

	return &pb.LogInResponse{User: mapper.ToProtoUser(&user), Token: token}, nil
}

func (s *Server) Validate(_ context.Context, req *pb.ValidateInput) (*pb.ValidateResponse, error) {
	claims, err := s.Jwt.ValidateToken(req.Token)

	if err != nil {
		return &pb.ValidateResponse{
			Error: err.Error(),
		}, nil
	}

	var user models.User

	if result := s.H.DB.Where(&models.User{Email: claims.Email}).First(&user); result.Error != nil {
		return &pb.ValidateResponse{
			Error: "User not found",
		}, nil
	}

	return &pb.ValidateResponse{
		UserId: user.Id,
	}, nil
}
