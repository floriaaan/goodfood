package services

import (
	"context"
	"github.com/gofrs/uuid"
	"github.com/golang/protobuf/ptypes/empty"
	"goodfood-user/pkg/mapper"
	"goodfood-user/pkg/models"
	"goodfood-user/pkg/utils"
	pb "goodfood-user/proto"
	"google.golang.org/grpc/status"
)

func (s *Server) GetUser(_ context.Context, req *pb.UserId) (*pb.UserOutput, error) {
	var user *models.User

	if result := s.H.DB.Where("id = ?", req.Id).Preload("Role").Preload("MainAddress").First(&user); result.Error != nil {
		return &pb.UserOutput{}, status.Error(404, "User not found")
	}

	return &pb.UserOutput{
		User: mapper.ToProtoUser(user),
	}, nil
}

func (s *Server) UpdateUser(_ context.Context, req *pb.UpdateUserInput) (*pb.UserOutput, error) {
	logger := utils.GetLogger()
	if req.User == nil || req.Token == "" {
		return &pb.UserOutput{}, status.Error(401, "Invalid request")
	}

	claims, err := s.Jwt.ValidateToken(req.Token)
	if err != nil {
		logger.Fatalf("Error validating token: %v", err)
		return &pb.UserOutput{}, status.Error(401, "Invalid token")
	}

	if result := s.H.DB.Where(&models.User{Id: uuid.FromStringOrNil(claims.Id)}); result.Error != nil {
		logger.Fatalf("User not found: %v", err)
		return &pb.UserOutput{}, status.Error(404, "User not found")
	}

	var user = mapper.UpdateInputToModelUser(req.User)

	s.H.DB.Updates(&user)

	return &pb.UserOutput{
		User: mapper.ToProtoUser(user),
	}, nil
}

func (s *Server) ListUser(_ context.Context, _ *empty.Empty) (*pb.UserList, error) {
	logger := utils.GetLogger()
	var users []*models.User
	if result := s.H.DB.Preload("Role").Preload("MainAddress").Find(&users); result.Error != nil {
		logger.Fatalf("User not found")
		return &pb.UserList{}, status.Error(404, "User not found")
	}

	return &pb.UserList{
		Users: mapper.ToProtoUsers(users),
	}, nil
}

func (s *Server) ChangePassword(_ context.Context, req *pb.ChangePasswordInput) (*pb.ChangePasswordOutput, error) {
	logger := utils.GetLogger()
	claims, err := s.Jwt.ValidateToken(req.Token)
	if err != nil {
		logger.Fatalf("Invalid token")
		return &pb.ChangePasswordOutput{}, status.Error(401, "Invalid token")
	}

	var user models.User
	if result := s.H.DB.Where(&models.User{Id: uuid.FromStringOrNil(claims.Id)}).First(&user); result.Error != nil {
		logger.Fatalf("User not found")
		return &pb.ChangePasswordOutput{}, status.Error(404, "User not found")
	}

	user.Password = utils.HashPassword(req.NewPassword)

	s.H.DB.Updates(&user)

	return &pb.ChangePasswordOutput{
		User: mapper.ToProtoUser(&user),
	}, nil
}

func (s *Server) DeleteUser(_ context.Context, req *pb.DeleteInput) (*pb.DeleteUserOutput, error) {
	logger := utils.GetLogger()
	if len(req.Id) <= 0 || req.Token == "" {
		logger.Fatalf("Invalid request")
		return &pb.DeleteUserOutput{}, status.Error(401, "Invalid request")
	}

	claims, err := s.Jwt.ValidateToken(req.Token)
	if err != nil {
		logger.Fatalf("Invalid request")
		return &pb.DeleteUserOutput{}, status.Error(401, "Invalid token")
	}
	var connectedUser models.User

	if result := s.H.DB.Where(&models.User{Id: uuid.FromStringOrNil(claims.Id)}).Preload("Role").First(&connectedUser); result.Error != nil || result.RowsAffected == 0 {
		logger.Fatalf("User not found")
		return &pb.DeleteUserOutput{}, status.Error(404, "User not found")
	}

	var user models.User
	var mainAddress models.MainAddress

	if result := s.H.DB.Where(&models.User{Id: uuid.FromStringOrNil(req.Id)}).Preload("Role").First(&user); result.Error != nil || result.RowsAffected == 0 {
		logger.Fatalf("User not found")
		return &pb.DeleteUserOutput{}, status.Error(404, "User not found")
	}

	if result := s.H.DB.Where(&models.MainAddress{Id: user.MainAddressId}).First(&mainAddress); result.Error != nil || result.RowsAffected == 0 {
		logger.Fatalf("Main address not found")
		return &pb.DeleteUserOutput{}, status.Error(404, "Main address not found")
	}

	if connectedUser.Role.Code == "ADMIN" || user.Id == connectedUser.Id {

		s.H.DB.Delete(&user)
		s.H.DB.Delete(&mainAddress)

		return &pb.DeleteUserOutput{
			User: mapper.ToProtoUser(&user),
		}, nil
	} else {
		logger.Fatalf("You are not allowed to delete this user")
		return &pb.DeleteUserOutput{}, status.Error(401, "You are not allowed to delete this user")
	}
}

func (s *Server) ChangeRole(_ context.Context, req *pb.ChangeRoleInput) (*pb.ChangeRoleOutput, error) {
	logger := utils.GetLogger()
	claims, err := s.Jwt.ValidateToken(req.Token)
	if err != nil {
		logger.Fatal("Invalid token", err)
		return &pb.ChangeRoleOutput{}, status.Error(401, "Invalid token")
	}

	var connectedUser models.User

	if result := s.H.DB.Where(&models.User{Id: uuid.FromStringOrNil(claims.Id)}).Preload("Role").First(&connectedUser); result.Error != nil {
		logger.Fatal("User not found", result.Error)
		return &pb.ChangeRoleOutput{}, status.Error(404, "User not found")
	}

	var user models.User
	var role models.Role

	if result := s.H.DB.Where(&models.User{Id: uuid.FromStringOrNil(req.UserId)}).Preload("Role").First(&user); result.Error != nil {
		logger.Fatal("User not found", result.Error)
		return &pb.ChangeRoleOutput{}, status.Error(404, "User not found")
	}

	if result := s.H.DB.Where(&models.Role{Code: req.RoleCode}).First(&role); result.Error != nil {
		logger.Fatal("User not found", result.Error)
		return &pb.ChangeRoleOutput{}, status.Error(404, "User not found")
	}
	logger.Fatalf("Role code", connectedUser.Role.Code)
	if connectedUser.Role.Code == "ADMIN" {
		user.Role = role
		s.H.DB.Save(&user)

		return &pb.ChangeRoleOutput{
			User: mapper.ToProtoUser(&user),
		}, nil
	} else {
		logger.Fatal("You are not allowed to change this user role")
		return &pb.ChangeRoleOutput{}, status.Error(401, "You are not allowed to change this user role")
	}
}
