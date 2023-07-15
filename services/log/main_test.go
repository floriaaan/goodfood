package main

import (
	"context"
	"testing"
	"time"

	pb "goodfood-log/proto"

	"github.com/golang/protobuf/ptypes/empty"
	"github.com/stretchr/testify/assert"
	"google.golang.org/protobuf/types/known/structpb"
	"gorm.io/gorm"
)

type mockservice struct {
	pb.LogServiceServer
	db *MockDB
}

func TestLogService(t *testing.T) {
	// create a new service instance with a mock database
	svc := mockservice{
		db: &MockDB{},
	}

	// create a new log using the CreateLog method
	ctx := context.Background()
	req := &pb.CreateLogRequest{
		EventMessage: "test event message",
		Metadata: &structpb.Struct{
			Fields: map[string]*structpb.Value{
				"test_field": {
					Kind: &structpb.Value_StringValue{
						StringValue: "test value",
					},
				},
			},
		},
	}

	res, err := svc.CreateLog(ctx, req)
	assert.NoError(t, err)
	assert.NotNil(t, res)
	assert.NotZero(t, res.Id)

	// retrieve the log using the GetLog method
	getReq := &pb.GetLogRequest{
		Id: res.Id,
	}
	log, err := svc.GetLog(ctx, getReq)
	assert.NoError(t, err)
	assert.NotNil(t, log)
	assert.Equal(t, req.EventMessage, log.EventMessage)

	// list all logs using the ListLog method
	emptyReq := &empty.Empty{}
	listRes, err := svc.ListLog(ctx, emptyReq)
	assert.NoError(t, err)
	assert.NotNil(t, listRes)
	assert.Len(t, listRes.Logs, 1)
	assert.Equal(t, res.Id, listRes.Logs[0].Id)

	// attempt to retrieve a nonexistent log
	badReq := &pb.GetLogRequest{
		Id: 999,
	}
	_, err = svc.GetLog(ctx, badReq)
	assert.Error(t, err)
}

type MockDB struct {
	logs []Log
}

func (db *MockDB) Create(log *Log) error {
	log.ID = uint(len(db.logs) + 1)
	log.Timestamp = time.Now()
	db.logs = append(db.logs, *log)
	return nil
}

func (db *MockDB) Get(id uint) (*Log, error) {
	for _, log := range db.logs {
		if log.ID == id {
			return &log, nil
		}
	}
	return nil, gorm.ErrRecordNotFound
}

func (db *MockDB) List() ([]Log, error) {
	return db.logs, nil
}

func (db *MockDB) Delete(id uint) error {
	for i, log := range db.logs {
		if log.ID == id {
			db.logs = append(db.logs[:i], db.logs[i+1:]...)
			return nil
		}
	}
	return gorm.ErrRecordNotFound
}

func (db *MockDB) Update(log *Log) error {
	for i, l := range db.logs {
		if l.ID == log.ID {
			db.logs[i] = *log
			return nil
		}
	}
	return gorm.ErrRecordNotFound
}

func (svc *mockservice) CreateLog(ctx context.Context, req *pb.CreateLogRequest) (*pb.Log, error) {
	bytes, _ := (*req.Metadata).MarshalJSON()
	log := Log{
		EventMessage: req.EventMessage,
		Metadata:     bytes,
	}

	err := svc.db.Create(&log)
	if err != nil {
		return nil, err
	}

	return log.ToProto(), nil
}

func (svc *mockservice) GetLog(ctx context.Context, req *pb.GetLogRequest) (*pb.Log, error) {
	log, err := svc.db.Get(uint(req.Id))
	if err != nil {
		return nil, err
	}

	return log.ToProto(), nil
}

func (svc *mockservice) ListLog(ctx context.Context, req *empty.Empty) (*pb.ListLogResponse, error) {
	logs, err := svc.db.List()
	if err != nil {
		return nil, err
	}

	var pbLogs []*pb.Log
	for _, log := range logs {

		if err != nil {
			return nil, err
		}

		pbLogs = append(pbLogs, log.ToProto())
	}

	return &pb.ListLogResponse{
		Logs: pbLogs,
	}, nil
}
