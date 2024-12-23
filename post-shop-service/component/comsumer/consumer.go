package comsumer

import "github.com/streadway/amqp"

func Consumer(ch *amqp.Channel, q *amqp.Queue) (<-chan amqp.Delivery, error) {
	return ch.Consume(
		q.Name, // Tên hàng đợi
		"",     // consumer
		true,   // auto-ack
		false,  // exclusive
		false,  // no-local
		false,  // no-wait
		nil,    // args
	)
}
