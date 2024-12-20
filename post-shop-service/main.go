package main

import (
	"encoding/json"
	"fmt"
	"log"
	"post-shop-service/common"
	appcontext "post-shop-service/component/app_context"
	"post-shop-service/config"
	posttranport "post-shop-service/module/post/tranport"
)

func failOnError(err error, msg string) {
	if err != nil {
		log.Fatalf("%s: %s", msg, err)
	}
}

func main() {
	// Kết nối RabbitMQ
	conn, ch, err := config.ConnectRabbitMQ()
	failOnError(err, "Failed to connect to RabbitMQ")
	defer conn.Close()
	defer ch.Close()
	config.NewLoadConfigENV()
	db := config.NewSqlInstance()
	appCtx := appcontext.NewAppContext(db, ch)

	// Khai báo hàng đợi
	q, err := ch.QueueDeclare(
		"go_service_queue", // Tên hàng đợi
		true,               // durable
		false,              // delete when unused
		false,              // exclusive
		false,              // no-wait
		nil,                // arguments
	)
	failOnError(err, "Failed to declare a queue")

	// Đăng ký consumer
	msgs, err := ch.Consume(
		q.Name, // Tên hàng đợi
		"",     // consumer
		true,   // auto-ack
		false,  // exclusive
		false,  // no-local
		false,  // no-wait
		nil,    // args
	)
	failOnError(err, "Failed to register a consumer")

	forever := make(chan bool)

	go func() {
		for d := range msgs {
			var payloadQueue common.PayloadQueue
			err := json.Unmarshal(d.Body, &payloadQueue)
			if err != nil {
				log.Printf("Failed to unmarshal message: %v", err)
				continue
			}

			fmt.Printf("Received a message: %v", payloadQueue.Data)

			switch payloadQueue.Pattern {
			case "create_post_event":
				if postData, ok := payloadQueue.Data.(map[string]interface{}); ok {
					var createPost common.CreatePost
					if title, ok := postData["title"].(string); ok {
						createPost.Title = title
					}
					if content, ok := postData["content"].(string); ok {
						createPost.Content = content
					}
					if shopID, ok := postData["shop_id"].(float64); ok { // float64 vì RabbitMQ có thể gửi số như vậy
						createPost.ShopID = int(shopID)
					}
					if hashtag, ok := postData["hashtag"].(string); ok {
						createPost.Hashtag = hashtag
					}
					if status, ok := postData["status"].(string); ok {
						createPost.Status = status
					}

					// Sau khi ép kiểu và gán giá trị, gọi phương thức tạo bài viết
					posttranport.CreatePost(appCtx, &createPost, &d)
				} else {
					log.Printf("Data in payloadQueue is not of type map[string]interface{}")
				}
			case "find_one_post_event":
				if id, ok := payloadQueue.Data.(float64); ok { // RabbitMQ có thể gửi số dưới dạng float64
					// Ép kiểu sang int64 sau khi đã kiểm tra kiểu float64
					posttranport.FindPost(appCtx, int64(id), &d)
				} else {
					log.Printf("Data in payloadQueue is not of type int64")
				}
			default:
				fmt.Printf("Unknown pattern: %s\n", payloadQueue.Pattern)
			}
		}
	}()

	log.Printf(" [*] Waiting for messages. To exit press CTRL+C")
	<-forever
}
