package main

import (
	"github.com/hhkbp2/go-logging"
	"goodfood-user/pkg/config"
	"goodfood-user/pkg/db"
	i "goodfood-user/pkg/db/init"
	"goodfood-user/pkg/services"
	"goodfood-user/pkg/utils"
	pb "goodfood-user/proto"
	"google.golang.org/grpc"
	"net"
)

func main() {
	utils.InitLogger()
	logger := utils.GetLogger()
	defer logging.Shutdown()

	c, err := config.LoadConfig()

	url := "localhost:" + c.Port

	if err != nil {
		logger.Fatal("Failed at config", err)
	}

	h := db.Init(c.DBUrl)
	i.InitDb(h)

	jwt := utils.JwtWrapper{
		SecretKey:       c.JWTSecretKey,
		Issuer:          "go-grpc-auth-svc",
		ExpirationHours: 1,
	}

	logger.Infof("Starting server at ", c.Port)

	lis, err := net.Listen("tcp", url)

	if err != nil {
		logger.Fatal("Failed to listing:", err)
	}

	s := services.Server{
		H:   h,
		Jwt: jwt,
	}

	grpcServer := grpc.NewServer()

	pb.RegisterUserServiceServer(grpcServer, &s)

	if err := grpcServer.Serve(lis); err != nil {
		logger.Fatal("Failed to serve:", err)
	}
}
