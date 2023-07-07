package services

import (
	"context"
	"goodfood-user/pkg/mapper"
	"goodfood-user/pkg/models"
	pb "goodfood-user/proto"
)

func (s *Server) GetMainAddress(_ context.Context, req *pb.MainAddressId) (*pb.MainAddress, error) {
	var address models.MainAddress

	if result := s.H.DB.Where(&models.User{Id: req.Id}).First(&address); result.Error != nil {
		return nil, result.Error
	}

	return mapper.ToProtoMainAddress(*&address), nil
}

func (s *Server) UpdateMainAddress(_ context.Context, req *pb.MainAddressUpdateInput) (*pb.UpdateMainAddressOutput, error) {
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
