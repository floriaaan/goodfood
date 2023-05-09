package models

type User struct {
	Id            int64  `json:"id" gorm:"primaryKey"`
	Email         string `json:"email" gorm:"type:varchar(255);not null"`
	Password      string `json:"password" gorm:"type:varchar(255);not null"`
	Phone         string `json:"phone" gorm:"type:varchar(10)"`
	LastName      string `json:"last_name" gorm:"type:varchar(100);not null"`
	FirstName     string `json:"first_name" gorm:"type:varchar(100);not null"`
	MainAddressId int64  `json:"main_address_id" gorm:"type:bigint;not null"`
	Role          Role   `json:"role" gorm:"foreignKey:RoleId"`
}
