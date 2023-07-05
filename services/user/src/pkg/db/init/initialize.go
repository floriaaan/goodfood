package db

import (
	"fmt"
	"goodfood-user/pkg/config"
	"goodfood-user/pkg/db"
	"goodfood-user/pkg/models"
	"goodfood-user/pkg/utils"
)

func InitDb(handler db.Handler) {

	log := utils.GetLogger()
	err := InitRoles(handler)
	if err != nil {
		log.Infof("While initialisation of roles :", err)
		return
	}

	er := InitUsers(handler)
	if er != nil {
		log.Infof("While initialisation of users :", er)
		return
	}
}

func InitRoles(handler db.Handler) error {
	log := utils.GetLogger()
	role := handler.DB.Find(&models.Role{})

	if role.Error != nil {
		log.Infof("While initialisation of roles :", role.Error)
		return role.Error
	}

	if role.RowsAffected > 0 {
		return nil
	}

	var roles = []models.Role{
		{
			Label: "Admin",
			Code:  "ADMIN",
		},
		{
			Label: "User",
			Code:  "user",
		},
		{
			Label: "Accountant",
			Code:  "accountant",
		},
		{
			Label: "Deliverer",
			Code:  "deliverer",
		},
	}

	if result := handler.DB.Create(&roles); result.Error != nil {
		fmt.Println(result.Error)
		return result.Error
	}

	return nil
}

func InitUsers(handler db.Handler) error {
	log := utils.GetLogger()

	c, _ := config.LoadConfig()

	isUser := handler.DB.Find(&models.User{})

	if isUser.Error != nil {
		log.Infof("While initialisation of isUsers :", isUser.Error)
		return isUser.Error
	}

	if isUser.RowsAffected > 0 {
		return nil
	}
	var role models.Role
	if result := handler.DB.Where(&models.Role{Code: "ADMIN"}).First(&role); result.Error != nil {
		fmt.Println(result.Error)
		return result.Error
	}

	user := models.User{
		FirstName:   "Admin",
		LastName:    "Admin",
		Email:       c.DefaultUserEmail,
		Password:    utils.HashPassword(c.DefaultUserPassword),
		Role:        role,
		MainAddress: models.MainAddress{Country: "France", ZipCode: "75000", Street: "Rue de la paix", Lat: 48.856614, Lng: 2.3522219},
	}

	if result := handler.DB.Create(&user); result.Error != nil {
		fmt.Println(result.Error)
		return result.Error
	}
	return nil
}
