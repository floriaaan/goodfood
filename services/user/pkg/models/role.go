package models

type Role struct {
	Id    uint64 `json:"id" gorm:"primaryKey;autoIncrement"`
	Code  string `json:"code" gorm:"type:varchar(255);uniqueIndex;not null"`
	Label string `json:"label" gorm:"type:varchar(255);not null"`
}
