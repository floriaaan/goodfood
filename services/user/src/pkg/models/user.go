package models

type User struct {
	Id          string      `json:"id" gorm:"primaryKey"`
	Email       string      `json:"email" gorm:"type:varchar(255);not null"`
	Password    string      `json:"password" gorm:"type:varchar(255);not null"`
	Phone       string      `json:"phone" gorm:"type:varchar(10)"`
	LastName    string      `json:"last_name" gorm:"type:varchar(100);not null"`
	FirstName   string      `json:"first_name" gorm:"type:varchar(100);not null"`
	MainAddress MainAddress `json:"main_address" gorm:"foreignKey:MainAddressId"`
	Role        Role        `json:"role" gorm:"foreignKey:RoleId"`
	Token       []uint8     `json:"token" gorm:"type:jsonb, default:'{}'"`
}