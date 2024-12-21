package poststorage

import (
	"context"
	"database/sql"
	"post-shop-service/common"
	postmodel "post-shop-service/module/post/model"
)

func (s *sqlStore) FindOne(ctx context.Context, id int64) (*postmodel.Post, error) {
	var post postmodel.Post

	row := s.db.QueryRowContext(ctx, "SELECT * FROM post WHERE id = ?", id)

	err := row.Scan(&post.ID, &post.Title, &post.Content, &post.ShopID, &post.Hashtag, &post.Status)
	if err != nil {
		// Kiểm tra lỗi nếu không tìm thấy bản ghi hoặc lỗi khác
		if err == sql.ErrNoRows {
			return nil, common.ErrEntityNotFound(postmodel.EntityName, id)
		}
		return nil, common.ErrCannotGetEntity(postmodel.EntityName, err)
	}

	// Trả về đối tượng post tìm được
	return &post, nil
}
