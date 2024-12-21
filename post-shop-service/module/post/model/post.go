package postmodel

import (
	"post-shop-service/common"
	"time"
)

const EntityName = "post"

type Post struct {
	ID           int           `db:"id"`            // Mã định danh bài viết
	Title        string        `db:"title"`         // Tiêu đề bài viết
	Content      string        `db:"content"`       // Nội dung bài viết
	ShopID       int           `db:"shop_id"`       // ID cửa hàng liên kết
	TotalLike    int           `db:"total_like"`    // Tổng số lượt thích
	TotalShare   int           `db:"total_share"`   // Tổng số lượt chia sẻ
	TotalComment int           `db:"total_comment"` // Tổng số bình luận
	TotalView    int           `db:"total_view"`    // Tổng số lượt xem
	CreatedAt    time.Time     `db:"created_at"`    // Thời điểm tạo bài viết
	UpdatedAt    time.Time     `db:"updated_at"`    // Thời điểm cập nhật bài viết
	Hashtag      *string       `db:"hashtag"`       // Hashtag bài viết
	Status       common.Status `db:"status"`        // Trạng thái bài viết
}

type CreatePost struct {
	Title   string `db:"title"`
	Content string `db:"content"`
	ShopID  int    `db:"shop_id"`
	Hashtag string `db:"hashtag"`
	Status  string `db:"status"`
}
