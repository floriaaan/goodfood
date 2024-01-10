package models

import (
	"github.com/gofrs/uuid"
)

type Role struct {
	Id    uuid.UUID `json:"id" gorm:"primaryKey;type:uuid;default:gen_random_uuid()"`
	Code  string    `json:"code" gorm:"type:varchar(255);uniqueIndex;not null"`
	Label string    `json:"label" gorm:"type:varchar(255);not null"`
}
