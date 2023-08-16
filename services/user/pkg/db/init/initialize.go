package db

import (
	"goodfood-user/pkg/config"
	"goodfood-user/pkg/db"
	"goodfood-user/pkg/models"
	"goodfood-user/pkg/utils"
)

func InitDb(handler db.Handler) {
	logger := utils.GetLogger()
	logger.Infof("Initializing database")
	err := InitRoles(handler)
	if err != nil {
		logger.Errorf("While initialisation of roles :", err)
		return
	}

	er := InitUsers(handler)
	if er != nil {
		logger.Errorf("While initialisation of users :", er)
		return
	}
}

func InitRoles(handler db.Handler) error {
	logger := utils.GetLogger()
	role := handler.DB.Find(&models.Role{})

	if role.Error != nil {
		logger.Errorf("While initialisation of roles :", role.Error)
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
			Code:  "USER",
		},
		{
			Label: "Accountant",
			Code:  "ACCOUNTANT",
		},
		{
			Label: "Deliverer",
			Code:  "DELIVERER",
		},
	}

	if result := handler.DB.Create(&roles); result.Error != nil {
		return result.Error
	}

	return nil
}

func InitUsers(handler db.Handler) error {
	logger := utils.GetLogger()

	c, _ := config.LoadConfig()

	isUser := handler.DB.Find(&models.User{})

	if isUser.Error != nil {
		logger.Errorf("While initialisation of isUsers :", isUser.Error)
		return isUser.Error
	}

	if isUser.RowsAffected > 0 {
		return nil
	}
	var role models.Role
	if result := handler.DB.Where(&models.Role{Code: "ADMIN"}).First(&role); result.Error != nil {
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
		return result.Error
	}
	return nil
}
