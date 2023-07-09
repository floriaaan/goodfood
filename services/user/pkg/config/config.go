package config

import "github.com/spf13/viper"

type Config struct {
	Port                string `mapstructure:"PORT"`
	DBUrl               string `mapstructure:"DB_URL"`
	JWTSecretKey        string `mapstructure:"JWT_SECRET_KEY"`
	DefaultUserEmail    string `mapstructure:"DEFAULT_USER_EMAIL"`
	DefaultUserPassword string `mapstructure:"DEFAULT_USER_PASSWORD"`
	LogFilePath         string `mapstructure:"LOG_FILE_PATH"`
}

func LoadConfig() (config Config, err error) {
	viper.AddConfigPath(".")
	viper.SetConfigName("dev")
	viper.SetConfigType("env")

	viper.AutomaticEnv()

	err = viper.ReadInConfig()

	if err != nil {
		return
	}

	err = viper.Unmarshal(&config)

	return
}
