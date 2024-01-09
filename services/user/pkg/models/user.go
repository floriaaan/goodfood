package models

import (
	"github.com/gofrs/uuid"
)

type User struct {
	Id            uuid.UUID `json:"id" gorm:"primaryKey;type:uuid;default:gen_random_uuid()"`
	Email         string    `json:"email" gorm:"type:varchar(255);not null;unique"`
	Password      string    `json:"password" gorm:"type:varchar(255);not null"`
	Phone         string    `json:"phone" gorm:"type:varchar(10)"`
	LastName      string    `json:"last_name" gorm:"type:varchar(100);not null"`
	FirstName     string    `json:"first_name" gorm:"type:varchar(100);not null"`
	MainAddressId uuid.UUID
	MainAddress   MainAddress `json:"main_address" gorm:"foreignKey:MainAddressId;references:Id"`
	RoleId        uuid.UUID
	Role          Role `json:"role" gorm:"foreignKey:RoleId"`
}
