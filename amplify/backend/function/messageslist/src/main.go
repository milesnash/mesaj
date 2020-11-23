package main

import (
	"bytes"
	"context"
	base32 "encoding/base32"
	"encoding/json"
	"errors"
	"fmt"
	"os"
	"time"

	"github.com/aws/aws-lambda-go/events"
	"github.com/aws/aws-lambda-go/lambda"
	"github.com/aws/aws-sdk-go/aws"
	"github.com/aws/aws-sdk-go/aws/session"
	"github.com/aws/aws-sdk-go/service/dynamodb"
	"github.com/aws/aws-sdk-go/service/dynamodb/dynamodbattribute"
	"github.com/aws/aws-sdk-go/service/dynamodb/expression"
)

type Request events.APIGatewayProxyRequest
type Response events.APIGatewayProxyResponse

type Message struct {
	ID      string `json:"id"`
	UserID  string `json:"userId"`
	SentAt  int64  `json:"sentAt"`
	Status  string `json:"status"`
	To      string `json:"to"`
	Content string `json:"content"`
}

func HandleGet() (messages []Message, err error) {
	sess := session.Must(session.NewSessionWithOptions(session.Options{
		SharedConfigState: session.SharedConfigEnable,
	}))

	svc := dynamodb.New(sess)

	keyCond := expression.Key("userId").Equal(expression.Value("1")) // TODO: Implement users

	expr, err := expression.NewBuilder().
		WithKeyCondition(keyCond).
		Build()

	if err != nil {
		return messages, err
	}

	input := &dynamodb.QueryInput{
		ExpressionAttributeNames:  expr.Names(),
		ExpressionAttributeValues: expr.Values(),
		KeyConditionExpression:    expr.KeyCondition(),
		ProjectionExpression:      expr.Projection(),
		TableName:                 aws.String(os.Getenv("STORAGE_MESSAGES_NAME")),
	}

	input.SetScanIndexForward(false) // TODO: Ordering
	input.SetLimit(5)                // TODO: Pagination

	result, err := svc.Query(input)

	if err != nil {
		return messages, err
	}

	for _, i := range result.Items {
		message := Message{}

		err = dynamodbattribute.UnmarshalMap(i, &message)

		if err != nil {
			return messages, err
		}

		messages = append(messages, message)
	}

	return messages, err
}

func HandlePost(message Message) (Message, error) {
	sess := session.Must(session.NewSessionWithOptions(session.Options{
		SharedConfigState: session.SharedConfigEnable,
	}))

	svc := dynamodb.New(sess)

	message.SentAt = time.Now().Unix()
	message.ID = base32.StdEncoding.EncodeToString([]byte(fmt.Sprint(message.SentAt)))
	message.UserID = "1"    // TODO: Implement users
	message.Status = "Sent" // TODO: Implement third-party messaging integration

	item, err := dynamodbattribute.MarshalMap(message)

	if err != nil {
		return message, err
	}

	input := &dynamodb.PutItemInput{
		Item:      item,
		TableName: aws.String(os.Getenv("STORAGE_MESSAGES_NAME")),
	}

	_, err = svc.PutItem(input)

	if err != nil {
		return message, err
	}

	return message, nil
}

func Handler(ctx context.Context, request Request) (Response, error) {
	var buf bytes.Buffer
	var body []byte
	var err error
	var statusCode = 200

	switch method := request.HTTPMethod; method {
	case "GET":
		var messages []Message
		messages, err = HandleGet()

		if err != nil {
			return Response{StatusCode: 500}, err
		}

		body, err = json.Marshal(messages)
		json.HTMLEscape(&buf, body)

	case "POST":
		var newMessage Message
		err = json.Unmarshal([]byte(request.Body), &newMessage)

		if err != nil {
			return Response{StatusCode: 500}, err
		}

		newMessage, err = HandlePost(newMessage)

		if err != nil {
			return Response{StatusCode: 500}, err
		}

		body, err = json.Marshal(newMessage)
		json.HTMLEscape(&buf, body)

	default:
		return Response{StatusCode: 405}, errors.New("Method not allowed")
	}

	if err != nil {
		return Response{StatusCode: 500}, err
	}

	resp := Response{
		StatusCode:      statusCode,
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
