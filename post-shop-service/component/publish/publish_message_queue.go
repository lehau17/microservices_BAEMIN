package publish

import "github.com/streadway/amqp"

type publishPayload struct {
	exchange  string
	key       string
	mandatory bool
	immediate bool
	msg       amqp.Publishing
}

func NewPublishPayload(exchange, key string, mandatory, immediate bool, msg amqp.Publishing) *publishPayload {
	return &publishPayload{
		exchange:  exchange,
		key:       key,
		mandatory: mandatory,
		immediate: immediate,
		msg:       msg,
	}
}

func Publish(ch *amqp.Channel, payload *publishPayload) error {
	return ch.Publish(
		payload.exchange,
		payload.key,
		payload.mandatory,
		payload.immediate,
		payload.msg,
	)
}
