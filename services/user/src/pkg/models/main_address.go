package models

type MainAddress struct {
	Id      int64   `json:"id" gorm:"primaryKey"`
	Street  string  `json:"street" gorm:"type:varchar(255);not null"`
	ZipCode string  `json:"zip_code" gorm:"type:varchar(5);not null"`
	Country string  `json:"country" gorm:"type:varchar(255);not null"`
	Lat     float64 `gorm:"type:decimal(10,8)"`
	Lng     float64 `gorm:"type:decimal(11,8)"`
}
