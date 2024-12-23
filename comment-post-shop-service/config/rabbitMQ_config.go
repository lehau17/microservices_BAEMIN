package config

import (
	"log"

	"github.com/streadway/amqp"
)

func ConnectRabbitMQ() (*amqp.Connection, *amqp.Channel, error) {
	conn, err := amqp.Dial("amqp://admin:1234@localhost:5672")
	if err != nil {
		log.Printf("Failed to connect to RabbitMQ: %v", err)
		return nil, nil, err
	}
	ch, err := conn.Channel()
	if err != nil {
		log.Printf("Failed to open a channel: %v", err)
		return nil, nil, err
	}
	log.Println("Successfully connected to RabbitMQ and opened a channel")
	return conn, ch, nil
}
