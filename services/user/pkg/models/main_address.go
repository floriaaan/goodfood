package models

import (
	"github.com/gofrs/uuid"
)

type MainAddress struct {
	Id      uuid.UUID `json:"id" gorm:"primaryKey;type:uuid;default:gen_random_uuid()"`
	Street  string    `json:"street" gorm:"type:varchar(255);not null"`
	ZipCode string    `json:"zip_code" gorm:"type:varchar(5);not null"`
	Country string    `json:"country" gorm:"type:varchar(255);not null"`
	Lat     float32   `gorm:"type:decimal(10,8)"`
	Lng     float32   `gorm:"type:decimal(11,8)"`
}
