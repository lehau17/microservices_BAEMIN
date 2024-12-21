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

	// Khai báo hàng đợic
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
			var payloadQueue common.PayloadQueue[common.CreatePost]
			// fmt.Printf("Received a message: %v\n", d.Body)

			err := json.Unmarshal(d.Body, &payloadQueue)
			if err != nil {
				log.Printf("Failed to unmarshal message: %v", err)
				continue
			}

			// fmt.Printf("Received a message: %v\n", payloadQueue.Data.Content)

			// Xử lý pattern
			switch payloadQueue.Pattern {
			case "create_post_event":
				fmt.Println("Create post event")
				posttranport.CreatePost(appCtx, &payloadQueue.Data, &d)
				// Thực hiện xử lý logic ở đây
			default:
				fmt.Printf("Unknown pattern: %s\n", payloadQueue.Pattern)
			}

			// Gửi phản hồi lại qua reply-to
			// err = ch.Publish(
			// 	"",        // exchange
			// 	d.ReplyTo, // routing key (reply-to queue)
			// 	false,     // mandatory
			// 	false,     // immediate
			// 	amqp.Publishing{
			// 		ContentType:   "application/json",
			// 		CorrelationId: d.CorrelationId,
			// 		Body:          d.Body,
			// 	},
			// )
			// if err != nil {
			// 	log.Printf("Failed to publish a message: %v", err)
			// }
		}
	}()

	log.Printf(" [*] Waiting for messages. To exit press CTRL+C")
	<-forever
}
