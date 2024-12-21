package appcontext

import (
	"github.com/jmoiron/sqlx"
	"github.com/streadway/amqp"
)

type AppContext interface {
	GetMainDBConnection() *sqlx.DB
	GetChannel() *amqp.Channel
}

type appCtx struct {
	db      *sqlx.DB
	channel *amqp.Channel
}

// GetSkio implements AppContect.

func NewAppContext(db *sqlx.DB, channel *amqp.Channel) *appCtx {
	return &appCtx{db: db, channel: channel}
}

func (ctx *appCtx) GetMainDBConnection() *sqlx.DB {
	return ctx.db
}

func (ctx *appCtx) GetChannel() *amqp.Channel {
	return ctx.channel
}
