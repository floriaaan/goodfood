package models

type User struct {
	Id            uint64 `json:"id" gorm:"primaryKey;autoIncrement"`
	Email         string `json:"email" gorm:"type:varchar(255);not null;unique"`
	Password      string `json:"password" gorm:"type:varchar(255);not null"`
	Phone         string `json:"phone" gorm:"type:varchar(10)"`
	LastName      string `json:"last_name" gorm:"type:varchar(100);not null"`
	FirstName     string `json:"first_name" gorm:"type:varchar(100);not null"`
	MainAddressId uint64
	MainAddress   MainAddress `json:"main_address" gorm:"foreignKey:MainAddressId;references:Id"`
	RoleId        uint64
	Role          Role `json:"role" gorm:"foreignKey:RoleId"`
}
