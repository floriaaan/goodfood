package utils

import (
	"github.com/hhkbp2/go-logging"
	"log"
)

var logger logging.Logger

func InitLogger() {
	configFile := "./config.yml"
	if err := logging.ApplyConfigFile(configFile); err != nil {
		panic(err.Error())
	}
	logger = logging.GetLogger("UserServicelogger")
	handler := logging.NewStdoutHandler()
	logger.AddHandler(handler)
}

func GetLogger() logging.Logger {
	if logger == nil {
		log.Fatal("[GetLogger]: call InitLogger first")
	}
	return logger
}
