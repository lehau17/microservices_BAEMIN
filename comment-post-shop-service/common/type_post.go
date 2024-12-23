package common

type Status string

const (
	Draft     Status = "draft"
	Published Status = "published"
	Archived  Status = "archived"
	Block     Status = "block"
	Deleted   Status = "deleted"
)

type PayloadQueue struct {
	Id      string      `json:"id"`
	Data    interface{} `json:"data"` // Thay interface{} bằng T
	Pattern string      `json:"pattern"`
}

type CreatePost struct {
	Title   string `json:"title"`
	Content string `json:"content"`
	ShopID  int    `json:"shop_id"`
	Hashtag string `json:"hashtag"`
	Status  string `json:"status"`
}
