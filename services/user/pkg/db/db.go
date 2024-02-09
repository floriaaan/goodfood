package db

import (
	"goodfood-user/pkg/models"
	"goodfood-user/pkg/utils"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

type Handler struct {
	DB *gorm.DB
}

func Init(url string) Handler {
	log := utils.GetLogger()
	db, err := gorm.Open(postgres.Open(url), &gorm.Config{})

	if err != nil {
		log.Fatal(err)
		return Handler{}
	}

	err = db.AutoMigrate(&models.Role{})
	if err != nil {
		return Handler{}
	}

	err = db.AutoMigrate(&models.MainAddress{})
	if err != nil {
		return Handler{}
	}

	err = db.AutoMigrate(&models.User{})
	if err != nil {
		return Handler{}
	}

	return Handler{db}
}
