package postmodel

import (
	"post-shop-service/common"
	"time"
)

const EntityName = "post"

type Post struct {
	ID           int           `db:"id" json:"id"`                       // Mã định danh bài viết
	Title        string        `db:"title" json:"title"`                 // Tiêu đề bài viết
	Content      string        `db:"content" json:"content"`             // Nội dung bài viết
	ShopID       int           `db:"shop_id" json:"shop_id"`             // ID cửa hàng liên kết
	TotalLike    int           `db:"total_like" json:"total_like"`       // Tổng số lượt thích
	TotalShare   int           `db:"total_share" json:"total_share"`     // Tổng số lượt chia sẻ
	TotalComment int           `db:"total_comment" json:"total_comment"` // Tổng số bình luận
	TotalView    int           `db:"total_view" json:"total_view"`       // Tổng số lượt xem
	CreatedAt    time.Time     `db:"created_at" json:"created_at"`       // Thời điểm tạo bài viết
	UpdatedAt    time.Time     `db:"updated_at" json:"updated_at"`       // Thời điểm cập nhật bài viết
	Hashtag      *string       `db:"hashtag" json:"hashtag,omitempty"`   // Hashtag bài viết
	Status       common.Status `db:"status" json:"status"`               // Trạng thái bài viết
}

type CreatePost struct {
	Title   string `db:"title"`
	Content string `db:"content"`
	ShopID  int    `db:"shop_id"`
	Hashtag string `db:"hashtag"`
	Status  string `db:"status"`
}

type QueryPost struct {
	Title   string `db:"title"`
	ShopID  int    `db:"shop_id"`
	Hashtag string `db:"hashtag"`
	Status  string `db:"status"`
}
