package models

type MainAddress struct {
	Id      uint64  `json:"id" gorm:"primaryKey;autoIncrement"`
	Street  string  `json:"street" gorm:"type:varchar(255);not null"`
	ZipCode string  `json:"zip_code" gorm:"type:varchar(5);not null"`
	Country string  `json:"country" gorm:"type:varchar(255);not null"`
	Lat     float32 `gorm:"type:decimal(10,8)"`
	Lng     float32 `gorm:"type:decimal(11,8)"`
}
