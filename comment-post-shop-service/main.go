package main

import (
	"comment-post-shop-service/common"
	appcontext "comment-post-shop-service/component/app_context"
	"comment-post-shop-service/component/comsumer"
	handlermessagebroken "comment-post-shop-service/component/handler_message_broken"
	queuedeclare "comment-post-shop-service/component/queue_declare"
	"comment-post-shop-service/config"
	"encoding/json"
	"log"
)

func failOnError(err error, msg string) {
	if err != nil {
		log.Fatalf("%s: %s", msg, err)
	}
}
func main() {
	conn, ch, err := config.ConnectRabbitMQ()
	failOnError(err, "Failed to connect to RabbitMQ")
	defer conn.Close()
	defer ch.Close()
	config.NewLoadConfigENV()
	db := config.NewSqlInstance()
	appCtx := appcontext.NewAppContext(db, ch)

	// Khai báo hàng đợi
	q, err := queuedeclare.QueueDeclare(ch)
	failOnError(err, "Failed to declare a queue")

	// Đăng ký consumer
	msgs, err := comsumer.Consumer(ch, &q)
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

			handlermessagebroken.HandlerMessageBroken(&payloadQueue, &d, appCtx)
		}
	}()

	log.Printf(" [*] Waiting for messages. To exit press CTRL+C")
	<-forever
}
