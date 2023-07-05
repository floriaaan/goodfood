package services

import (
	"context"
	"github.com/golang/protobuf/ptypes/empty"
	"goodfood-user/pkg/mapper"
	"goodfood-user/pkg/models"
	"goodfood-user/pkg/utils"
	pb "goodfood-user/proto"
)

func (s *Server) GetUser(ctx context.Context, req *pb.UserId) (*pb.User, error) {
	var user models.User

	if result := s.H.DB.Where(&models.User{Id: req.Id}).First(&user); result.Error == nil {
		return nil, result.Error
	}

	return mapper.ToProtoUser(&user), nil
}

func (s *Server) UpdateUser(ctx context.Context, req *pb.UpdateUserInput) (*pb.UpdateUserOutput, error) {
	claims, err := s.Jwt.ValidateToken(req.Token)
	if err != nil {
		return &pb.UpdateUserOutput{
			Error: "Invalid token",
		}, nil
	}

	if result := s.H.DB.Where(&models.User{Id: claims.Id}); result.Error != nil {
		return &pb.UpdateUserOutput{
			Error: "User not found",
		}, nil
	}
	var user = mapper.ToModelUser(req.User)

	s.H.DB.Save(&user)

	return &pb.UpdateUserOutput{
		User: mapper.ToProtoUser(user),
	}, nil
}

func (s *Server) ListUser(ctx context.Context, _ *empty.Empty) (*pb.UserList, error) {
	var users []*models.User
	s.H.DB.Find(&users)
	return &pb.UserList{
		Users: mapper.ToProtoUsers(users),
	}, nil
}

func (s *Server) ChangePassword(ctx context.Context, req *pb.ChangePasswordInput) (*pb.ChangePasswordOutput, error) {
	claims, err := s.Jwt.ValidateToken(req.Token)
	if err != nil {
		return &pb.ChangePasswordOutput{
			Error: "Invalid token",
		}, nil
	}

	var user models.User
	if result := s.H.DB.Where(&models.User{Id: claims.Id}); result.Error != nil {
		return &pb.ChangePasswordOutput{
			Error: "User not found",
		}, nil
	}

	user.Password = utils.HashPassword(req.NewPassword)

	s.H.DB.Save(&user)

	return &pb.ChangePasswordOutput{
		User: mapper.ToProtoUser(&user),
	}, nil
}

func (s *Server) DeleteUser(ctx context.Context, req *pb.DeleteInput) (*pb.DeleteUserOutput, error) {
	claims, err := s.Jwt.ValidateToken(req.Token)
	if err != nil {
		return &pb.DeleteUserOutput{
			Error: "Invalid token",
		}, nil
	}

	var user models.User

	if result := s.H.DB.Where(&models.User{Id: claims.Id}); result.Error != nil {
		return &pb.DeleteUserOutput{
			Error: "User not found",
		}, nil
	}

	if user.Role.Code == "ADMIN" || user.Id == req.UserId {

		s.H.DB.Delete(&user)

		return &pb.DeleteUserOutput{
			User: mapper.ToProtoUser(&user),
		}, nil
	} else {
		return &pb.DeleteUserOutput{
			Error: "You are not allowed to change this user role",
		}, nil
	}
}

func (s *Server) ChangeRole(ctx context.Context, req *pb.ChangeRoleInput) (*pb.ChangeRoleOutput, error) {
	claims, err := s.Jwt.ValidateToken(req.Token)
	if err != nil {
		return &pb.ChangeRoleOutput{
			Error: "Invalid token",
		}, nil
	}

	var user models.User
	var role models.Role

	if result := s.H.DB.Where(&models.User{Id: claims.Id}); result.Error != nil {
		return &pb.ChangeRoleOutput{
			Error: "User not found",
		}, nil
	}

	if result := s.H.DB.Where(&models.Role{Code: req.RoleCode}); result.Error != nil {
		return &pb.ChangeRoleOutput{
			Error: "User not found",
		}, nil
	}

	if user.Role.Code == "ADMIN" || user.Id == req.UserId {
		user.Role = role
		s.H.DB.Save(&user)

		return &pb.ChangeRoleOutput{
			User: mapper.ToProtoUser(&user),
		}, nil
	} else {
		return &pb.ChangeRoleOutput{
			Error: "You are not allowed to change this user role",
		}, nil
	}
}
