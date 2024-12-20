package appcontext

import (
	"github.com/jmoiron/sqlx"
)

type AppContext interface {
	GetMainDBConnection() *sqlx.DB

}

type appCtx struct {
	db             *sqlx.DB
}

// GetSkio implements AppContect.

func NewAppContext(db *sqlx.DB) *appCtx {
	return &appCtx{db: db}
}

func (ctx *appCtx) GetMainDBConnection() *sqlx.DB {
	return ctx.db
}


