package services

import (
	"context"
	"github.com/golang/protobuf/ptypes/empty"
	"goodfood-user/pkg/mapper"
	"goodfood-user/pkg/models"
	"goodfood-user/pkg/utils"
	pb "goodfood-user/proto"
)

func (s *Server) GetUser(_ context.Context, req *pb.UserId) (*pb.UserOutput, error) {
	var user *models.User

	if result := s.H.DB.Where("id = ?", req.Id).Preload("Role").Preload("MainAddress").First(&user); result.Error != nil {
		return &pb.UserOutput{
			Error: result.Error.Error(),
		}, nil
	}

	return &pb.UserOutput{
		User: mapper.ToProtoUser(user),
	}, nil
}

func (s *Server) UpdateUser(_ context.Context, req *pb.UpdateUserInput) (*pb.UserOutput, error) {
	if req.User == nil || req.Token == "" {
		return &pb.UserOutput{
			Error: "Invalid request",
		}, nil
	}

	claims, err := s.Jwt.ValidateToken(req.Token)
	if err != nil {
		return &pb.UserOutput{
			Error: "Invalid token",
		}, nil
	}

	if result := s.H.DB.Where(&models.User{Id: claims.Id}); result.Error != nil {
		return &pb.UserOutput{
			Error: "User not found",
		}, nil
	}
	var user = mapper.UpdateInputToModelUser(req.User)

	s.H.DB.Updates(&user)

	return &pb.UserOutput{
		User: mapper.ToProtoUser(user),
	}, nil
}

func (s *Server) ListUser(_ context.Context, _ *empty.Empty) (*pb.UserList, error) {
	var users []*models.User
	if result := s.H.DB.Preload("Role").Preload("MainAddress").Find(&users); result.Error != nil {
		return &pb.UserList{
			Error: "Users not found",
		}, nil
	}

	return &pb.UserList{
		Users: mapper.ToProtoUsers(users),
	}, nil
}

func (s *Server) ChangePassword(_ context.Context, req *pb.ChangePasswordInput) (*pb.ChangePasswordOutput, error) {
	claims, err := s.Jwt.ValidateToken(req.Token)
	if err != nil {
		return &pb.ChangePasswordOutput{
			Error: "Invalid token",
		}, nil
	}

	var user models.User
	if result := s.H.DB.Where(&models.User{Id: claims.Id}).First(&user); result.Error != nil {
		return &pb.ChangePasswordOutput{
			Error: "User not found",
		}, nil
	}

	user.Password = utils.HashPassword(req.NewPassword)

	s.H.DB.Updates(&user)

	return &pb.ChangePasswordOutput{
		User: mapper.ToProtoUser(&user),
	}, nil
}

func (s *Server) DeleteUser(_ context.Context, req *pb.DeleteInput) (*pb.DeleteUserOutput, error) {
	if req.UserId == 0 || req.Token == "" {
		return &pb.DeleteUserOutput{
			Error: "Invalid request",
		}, nil
	}

	claims, err := s.Jwt.ValidateToken(req.Token)
	if err != nil {
		return &pb.DeleteUserOutput{
			Error: "Invalid token",
		}, nil
	}
	var connectedUser models.User

	if result := s.H.DB.Where(&models.User{Id: claims.Id}).Preload("Role").First(&connectedUser); result.Error != nil || result.RowsAffected == 0 {
		return &pb.DeleteUserOutput{
			Error: "User not found",
		}, nil
	}

	var user models.User
	var mainAddress models.MainAddress

	if result := s.H.DB.Where(&models.User{Id: req.UserId}).Preload("Role").First(&user); result.Error != nil || result.RowsAffected == 0 {
		return &pb.DeleteUserOutput{
			Error: "User not found",
		}, nil
	}

	if result := s.H.DB.Where(&models.MainAddress{Id: user.MainAddressId}).First(&mainAddress); result.Error != nil || result.RowsAffected == 0 {
		return &pb.DeleteUserOutput{
			Error: "Main address not found",
		}, nil
	}

	if user.Role.Code == "ADMIN" || user.Id == connectedUser.Id {

		s.H.DB.Delete(&user)
		s.H.DB.Delete(&mainAddress)

		return &pb.DeleteUserOutput{
			User: mapper.ToProtoUser(&user),
		}, nil
	} else {
		return &pb.DeleteUserOutput{
			Error: "You are not allowed to delete this user",
		}, nil
	}
}

func (s *Server) ChangeRole(_ context.Context, req *pb.ChangeRoleInput) (*pb.ChangeRoleOutput, error) {
	claims, err := s.Jwt.ValidateToken(req.Token)
	if err != nil {
		return &pb.ChangeRoleOutput{
			Error: "Invalid token",
		}, nil
	}

	var connectedUser models.User

	if result := s.H.DB.Where(&models.User{Id: claims.Id}).First(&connectedUser); result.Error != nil {
		return &pb.ChangeRoleOutput{
			Error: "User not found",
		}, nil
	}

	var user models.User
	var role models.Role

	if result := s.H.DB.Where(&models.User{Id: req.UserId}).First(&user); result.Error != nil {
		return &pb.ChangeRoleOutput{
			Error: "User not found",
		}, nil
	}

	if result := s.H.DB.Where(&models.Role{Code: req.RoleCode}).First(&role); result.Error != nil {
		return &pb.ChangeRoleOutput{
			Error: "User not found",
		}, nil
	}

	if user.Role.Code == "ADMIN" {
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