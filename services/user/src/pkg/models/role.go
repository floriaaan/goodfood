package models

type Role struct {
	Id    string `json:"id" gorm:"primaryKey"`
	Code  string `json:"code" gorm:"type:varchar(255);uniqueIndex;not null"`
	Label string `json:"label" gorm:"type:varchar(255);not null"`
}
