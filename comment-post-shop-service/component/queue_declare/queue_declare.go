package queuedeclare

import "github.com/streadway/amqp"

func QueueDeclare(ch *amqp.Channel) (amqp.Queue, error) {
	return ch.QueueDeclare(
		"comment_queue", // Tên hàng đợi
		true,            // durable
		false,           // delete when unused
		false,           // exclusive
		false,           // no-wait
		nil,             // arguments
	)
}
