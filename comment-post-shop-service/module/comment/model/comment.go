package commentmodel

const EntityName = "comments"

// User đại diện cho thông tin người dùng
type User struct {
	ID       int64  `json:"id"`       // ID của người dùng
	Username string `json:"username"` // Tên người dùng
	Email    string `json:"email"`    // Email của người dùng
}

// Comment đại diện cho bình luận, liên kết với Post và User
type Comment struct {
	ID        int64  `db:"id" json:"id"`                 // ID của comment
	PostID    int64  `db:"post_id" json:"post_id"`       // ID của bài đăng (Post)
	User      string `db:"user" json:"user"`             // Thông tin người dùng dưới dạng JSON (User)
	Content   string `db:"content" json:"content"`       // Nội dung bình luận
	CreatedAt string `db:"created_at" json:"created_at"` // Thời gian tạo bình luận
	UpdatedAt string `db:"updated_at" json:"updated_at"` // Thời gian cập nhật bình luận
}

type CommentCreate struct {
	PostID  int64  `db:"post_id" json:"post_id"`
	User    string `db:"user" json:"user"`
	Content string `db:"content" json:"content"`
}

type CommentUpdate struct {
	ID      int64  `db:"id" json:"id"`
	UserID  string `json:"user_id"`
	Content string `db:"content" json:"content"`
}
