package commentstorage

import "github.com/jmoiron/sqlx"

type sqlStorage struct {
	db *sqlx.DB
}

func NewSqlStorage(db *sqlx.DB) *sqlStorage {
	return &sqlStorage{db: db}
}
