package main

import (
	"bytes"
	"context"
	"encoding/json"
	"time"

	"github.com/aws/aws-lambda-go/events"
	"github.com/aws/aws-lambda-go/lambda"
)

type Response events.APIGatewayProxyResponse

type Message struct {
	ID      string `json:"id"`
	SentAt  int64  `json:"sentAt"`
	Status  string `json:"status"`
	To      string `json:"to"`
	Content string `json:"content"`
}

func Handler(ctx context.Context) (Response, error) {
	var buf bytes.Buffer

	messages := []Message{
		Message{
			"3",
			time.Now().Unix(),
			"Sent",
			"07700900002",
			"The rain in Spain falls mainly on the plain.",
		},
		Message{
			"2",
			time.Now().Unix(),
			"Sent",
			"07700900001",
			"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras eu tempus nisi, sed maximus arcu.",
		},
		Message{
			"1",
			time.Now().Unix(),
			"Sent",
			"07700900000",
			"This came from the server!",
		},
	}

	body, err := json.Marshal(messages)
	if err != nil {
		return Response{StatusCode: 404}, err
	}
	json.HTMLEscape(&buf, body)

	resp := Response{
		StatusCode:      200,
		IsBase64Encoded: false,
		Body:            buf.String(),
		Headers: map[string]string{
			"Content-Type":                 "application/json",
			"Access-Control-Allow-Origin":  "*",
			"Access-Control-Allow-Methods": "POST, GET, OPTIONS",
			"Access-Control-Allow-Headers": "Accept, Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization",
		},
	}

	return resp, nil
}

func main() {
	lambda.Start(Handler)
}
