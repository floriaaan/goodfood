package mapper

import (
	"encoding/json"
	"fmt"
	"goodfood-user/pkg/models"
	pb "goodfood-user/proto"
	"google.golang.org/protobuf/types/known/structpb"
)

func ToProtoUser(user *models.User) *pb.User {
	TokenMap := make(map[string]interface{})
	err := json.Unmarshal(user.Token, &TokenMap)
	if err != nil {
		fmt.Printf("failed to unmarshal metadata: %v", err)
	}
	token, _ := structpb.NewStruct(TokenMap)

	return &pb.User{
		Id:          user.Id,
		FirstName:   user.FirstName,
		LastName:    user.LastName,
		Email:       user.Email,
		Phone:       user.Phone,
		MainAddress: ToProtoMainAddress(user.MainAddress),
		Role:        ToProtoRole(user.Role),
		Token:       token,
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
