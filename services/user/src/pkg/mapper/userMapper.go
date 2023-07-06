package mapper

import (
	"goodfood-user/pkg/models"
	"goodfood-user/pkg/utils"
	pb "goodfood-user/proto"
)

func ToProtoUsers(userList []*models.User) []*pb.User {
	var users []*pb.User
	for _, u := range userList {
		utils.GetLogger().Infof("ToProtoUsers", u.Email)

		users = append(users, ToProtoUser(u))
	}

	return users
}

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

func ToModelUser(user *pb.User) *models.User {
	return &models.User{
		Id:          user.Id,
		FirstName:   user.FirstName,
		LastName:    user.LastName,
		Email:       user.Email,
		Phone:       user.Phone,
		MainAddress: *ToModelMainAddress(user.MainAddress),
		Role:        *ToModelRole(user.Role),
	}
}

func InputToModelUser(user *pb.UserCreateInput) *models.User {
	return &models.User{
		FirstName:   user.FirstName,
		LastName:    user.LastName,
		Email:       user.Email,
		Phone:       user.Phone,
		MainAddress: *InputToModelMainAddress(user.MainAddress),
	}
}

func InputToModelMainAddress(address *pb.MainAddressInput) *models.MainAddress {
	return &models.MainAddress{
		Street:  address.Street,
		ZipCode: address.ZipCode,
		Country: address.Country,
		Lat:     address.Lat,
		Lng:     address.Lng,
	}
}

func ToModelMainAddress(address *pb.MainAddress) *models.MainAddress {
	return &models.MainAddress{
		Id:      address.Id,
		Street:  address.Street,
		ZipCode: address.ZipCode,
		Country: address.Country,
		Lat:     address.Lat,
		Lng:     address.Lng,
	}
}

func ToModelRole(role *pb.Role) *models.Role {
	return &models.Role{
		Id:    role.Id,
		Label: role.Label,
		Code:  role.Code,
	}
}
