package config

import (
	"github.com/streadway/amqp"
)

func ConnectRabbitMQ() (*amqp.Connection, *amqp.Channel, error) {
	conn, err := amqp.Dial("amqp://admin:1234@localhost:5672/")
	if err != nil {
		return nil, nil, err
	}
	defer conn.Close()

	ch, err := conn.Channel()
	if err != nil {
		return nil, nil, err
	}
	defer ch.Close()
	return conn, ch, nil
}
