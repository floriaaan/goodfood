package mapper

import (
	"goodfood-user/pkg/models"
	pb "goodfood-user/proto"
)

func ToProtoUser(user *models.User) *pb.User {
	return &pb.User{
		Id:          user.Id,
		FirstName:   user.FirstName,
		LastName:    user.LastName,
		Email:       user.Email,
		Phone:       user.Phone,
		MainAddress: ToProtoMainAddress(user.MainAddress),
		Role:        ToProtoRole(user.Role),
	}
}

func ToProtoMainAddress(address models.MainAddress) *pb.MainAddress {
	return &pb.MainAddress{
		Id:      address.Id,
		Street:  address.Street,
		ZipCode: address.ZipCode,
		Country: address.Country,
		Lat:     address.Lat,
		Lng:     address.Lng,
	}
}

func ToProtoRole(role models.Role) *pb.Role {
	return &pb.Role{
		Id:    role.Id,
		Label: role.Label,
		Code:  role.Code,
	}
}
