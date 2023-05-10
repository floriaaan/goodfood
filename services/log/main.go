package main

import (
	"context"
	"encoding/json"
	"fmt"
	"log"
	"net"
	"os"
	"time"

	pb "goodfood-log/proto"

	amqp "github.com/rabbitmq/amqp091-go"

	"github.com/joho/godotenv"

	"github.com/golang/protobuf/ptypes/empty"
	"google.golang.org/grpc"
	"google.golang.org/grpc/reflection"
	"google.golang.org/protobuf/types/known/structpb"
	"google.golang.org/protobuf/types/known/timestamppb"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

type Log struct {
	ID           uint      `gorm:"primarykey" json:"id"`
	EventMessage string    `gorm:"not null" json:"event_message"`
	Metadata     []uint8   `gorm:"type:jsonb" default:"{}" json:"metadata"`
	Timestamp    time.Time `gorm:"default:current_timestamp" json:"timestamp"`
}

type service struct {
	pb.LogServiceServer
	DB *gorm.DB
}

func (l *Log) ToProto() *pb.Log {
	metadataMap := make(map[string]interface{})
	err := json.Unmarshal(l.Metadata, &metadataMap)
	if err != nil {
		fmt.Printf("failed to unmarshal metadata: %v", err)
	}
	metadata, _ := structpb.NewStruct(metadataMap)

	return &pb.Log{
		Id:           int32(l.ID),
		EventMessage: l.EventMessage,
		Metadata:     metadata,
		Timestamp:    &timestamppb.Timestamp{Seconds: l.Timestamp.Unix(), Nanos: int32(l.Timestamp.Nanosecond())},
	}
}

func (s *service) CreateLog(ctx context.Context, req *pb.CreateLogRequest) (*pb.CreateLogResponse, error) {
	bytes, _ := (*req.Metadata).MarshalJSON()

	log := &Log{
		EventMessage: req.EventMessage,
		Metadata:     bytes,
	}
	result := s.DB.Create(log)
	if result.Error != nil {
		return nil, result.Error
	}
	return &pb.CreateLogResponse{
		Id: int32(log.ID),
	}, nil
}

func (s *service) GetLog(ctx context.Context, req *pb.GetLogRequest) (*pb.Log, error) {
	var log Log
	result := s.DB.First(&log, req.Id)
	if result.Error != nil {
		return nil, result.Error
	}
	return log.ToProto(), nil
}

func (s *service) ListLog(ctx context.Context, _ *empty.Empty) (*pb.ListLogResponse, error) {
	var logs []Log
	result := s.DB.Find(&logs)
	if result.Error != nil {
		return nil, result.Error
	}

	logMessages := make([]*pb.Log, len(logs))
	for i, log := range logs {
		logMessages[i] = log.ToProto()
	}

	return &pb.ListLogResponse{
		Logs: logMessages,
	}, nil
}

func HandleAMQPMessage(d amqp.Delivery, db *gorm.DB) (bool, error) {
	date := time.Now().Format("2006-01-02 15:04:05")
	fmt.Printf("\x1b[35m%s\x1b[0m | \x1b[31mAMQP\x1b[0m | \x1b[33m%s\x1b[0m\n", date, d.Body)

	// d.Body is a string (JSON stringified)
	jsonMap := make(map[string]interface{})
	err := json.Unmarshal(d.Body, &jsonMap)
	if err != nil {
		return false, err
	}
	metadata := jsonMap["metadata"].(map[string]interface{})
	metadataBytes, err := json.Marshal(metadata)
	if err != nil {
		return false, err
	}

	log := &Log{
		EventMessage: jsonMap["event_message"].(string),
		Metadata:     metadataBytes,
	}
	result := db.Create(log)
	if result.Error != nil {
		return false, result.Error
	}

	return true, nil
}

func ConnectToDB(connectionString string) (*gorm.DB, error) {
	db, err := gorm.Open(postgres.Open(connectionString), &gorm.Config{})
	db.AutoMigrate(&Log{})
	if err != nil {
		return nil, err
	}
	return db, nil
}

func ConsoleLog(ctx context.Context, req interface{}, info *grpc.UnaryServerInfo, handler grpc.UnaryHandler) (interface{}, error) {
	date := time.Now().Format("2006-01-02 15:04:05")
	fmt.Printf("\x1b[35m%s\x1b[0m | \x1b[36mGRPC\x1b[0m | \x1b[33m%s\x1b[0m\n", date, info.FullMethod)
	return handler(ctx, req)
}

func failOnError(err error, msg string) {
	if err != nil {
		log.Panicf("%s: %s", msg, err)
	}
}

func main() {
	err := godotenv.Load()
	if err != nil {
		fmt.Printf("failed to load env file: %v\nusing arguments as env. vars", err)
	}
	dbURI := os.Getenv("DATABASE_URL")
	port := os.Getenv("PORT")
	amqpURI := os.Getenv("AMQP_URL")

	db, err := ConnectToDB(dbURI)
	failOnError(err, "failed to connect to database")

	lis, err := net.Listen("tcp", fmt.Sprintf(":%s", port))
	failOnError(err, "failed to listen")
	defer lis.Close()

	conn, err := amqp.Dial(amqpURI)
	failOnError(err, "Failed to connect to RabbitMQ")
	defer conn.Close()

	ch, err := conn.Channel()
	failOnError(err, "Failed to open a channel")
	defer ch.Close()

	q, err := ch.QueueDeclare(
		"log", // name
		false, // durable
		false, // delete when unused
		false, // exclusive
		false, // no-wait
		nil,   // arguments
	)
	failOnError(err, "Failed to declare a queue")

	msgs, err := ch.Consume(
		q.Name, // queue
		"",     // consumer
		true,   // auto-ack
		false,  // exclusive
		false,  // no-local
		false,  // no-wait
		nil,    // args
	)
	failOnError(err, "Failed to register a consumer")

	go func() {
		for d := range msgs {
			HandleAMQPMessage(d, db)
		}
	}()

	server := grpc.NewServer(
		grpc.UnaryInterceptor(
			ConsoleLog,
		),
	)
	service := &service{
		DB: db,
	}

	reflection.Register(server)
	pb.RegisterLogServiceServer(server, service)

	fmt.Println("---- \x1b[32mgood\x1b[0m\x1b[33mfood\x1b[0m Log Service ----")
	fmt.Printf("started on: \x1b[1m0.0.0.0:%s\x1b[0m \x1b[32m✓\x1b[0m\n\n", port)
	if err := server.Serve(lis); err != nil {
		log.Fatalf("failed to serve: %v", err)
	}
}
