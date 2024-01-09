package services

import (
	"context"
	"github.com/gofrs/uuid"
	"goodfood-user/pkg/db"
	"goodfood-user/pkg/mapper"
	"goodfood-user/pkg/models"
	"goodfood-user/pkg/utils"
	pb "goodfood-user/proto"
	"google.golang.org/grpc/status"
)

type MainAddressServer struct {
	pb.UnimplementedMainAddressServiceServer
	H   db.Handler
	Jwt utils.JwtWrapper
}

func (s *MainAddressServer) GetMainAddress(_ context.Context, req *pb.MainAddressId) (*pb.MainAddressOutput, error) {
	logger := utils.GetLogger()
	var address models.MainAddress

	if result := s.H.DB.Where(&models.MainAddress{Id: uuid.FromStringOrNil(req.Id)}).First(&address); result.Error != nil {
		logger.Fatalf("Main address not found: %v", result.Error)
		return &pb.MainAddressOutput{}, status.Error(404, "Main address not found")
	}

	return &pb.MainAddressOutput{
		MainAddress: mapper.ToProtoMainAddress(address),
	}, nil
}

func (s *MainAddressServer) UpdateMainAddress(_ context.Context, req *pb.MainAddressUpdateInput) (*pb.UpdateMainAddressOutput, error) {
	logger := utils.GetLogger()
	claims, err := s.Jwt.ValidateToken(req.Token)
	if err != nil {
		logger.Fatalf("Error validating token: %v", err)
		return &pb.UpdateMainAddressOutput{}, status.Error(401, "Invalid token")
	}

	if result := s.H.DB.Where(&models.User{Id: uuid.FromStringOrNil(claims.Id)}); result.Error != nil {
		logger.Fatalf("User not found: %v", result.Error)
		return &pb.UpdateMainAddressOutput{}, status.Error(404, "User not found")
	}

	var mainAddress = mapper.UpdateInputToModelMainAddress(req.MainAddress)

	s.H.DB.Updates(&mainAddress)

	return &pb.UpdateMainAddressOutput{
		MainAddress: mapper.ToProtoMainAddress(*mainAddress),
	}, nil
}
