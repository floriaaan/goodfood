package services

import (
	"context"
	"goodfood-user/pkg/db"
	"goodfood-user/pkg/mapper"
	"goodfood-user/pkg/models"
	"goodfood-user/pkg/utils"
	pb "goodfood-user/proto"
)

type MainAddressServer struct {
	pb.UnimplementedMainAddressServiceServer
	H   db.Handler
	Jwt utils.JwtWrapper
}

func (s *MainAddressServer) GetMainAddress(_ context.Context, req *pb.MainAddressId) (*pb.MainAddressOutput, error) {
	var address models.MainAddress

	if result := s.H.DB.Where(&models.MainAddress{Id: req.Id}).First(&address); result.Error != nil {
		return &pb.MainAddressOutput{
			Error: "Main address not found",
		}, nil
	}

	return &pb.MainAddressOutput{
		MainAddress: mapper.ToProtoMainAddress(address),
	}, nil
}

func (s *MainAddressServer) UpdateMainAddress(_ context.Context, req *pb.MainAddressUpdateInput) (*pb.UpdateMainAddressOutput, error) {
	claims, err := s.Jwt.ValidateToken(req.Token)
	if err != nil {
		return &pb.UpdateMainAddressOutput{
			Error: "Invalid token",
		}, nil
	}

	if result := s.H.DB.Where(&models.User{Id: claims.Id}); result.Error != nil {
		return &pb.UpdateMainAddressOutput{
			Error: "User not found",
		}, nil
	}

	var mainAddress = mapper.UpdateInputToModelMainAddress(req.MainAddress)

	s.H.DB.Updates(&mainAddress)

	return &pb.UpdateMainAddressOutput{
		MainAddress: mapper.ToProtoMainAddress(*mainAddress),
	}, nil
}
