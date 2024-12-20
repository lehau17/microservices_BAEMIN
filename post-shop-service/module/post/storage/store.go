package poststorage

import (
	"github.com/jmoiron/sqlx"
)

type sqlStore struct {
	db *sqlx.DB
}


func NewSqlStore(db *sqlx.DB) *sqlStore {
	return &sqlStore{db: db}
}
