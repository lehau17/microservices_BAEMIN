package common

type Status string

const (
	Draft     Status = "draft"
	Published Status = "published"
	Archived  Status = "archived"
	Block     Status = "block"
	Deleted   Status = "deleted"
)