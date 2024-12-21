package poststorage

import (
	"context"
	"database/sql"
	"post-shop-service/common"
	postmodel "post-shop-service/module/post/model"
)

func (s *sqlStore) FindOne(ctx context.Context, id int64) (*postmodel.Post, error) {
	var post postmodel.Post

	// Truy vấn dữ liệu từ cơ sở dữ liệu
	query := "SELECT * FROM post WHERE id = ?"
	err := s.db.GetContext(ctx, &post, query, id)
	if err != nil {
		if err == sql.ErrNoRows {
			return nil, common.ErrEntityNotFound(postmodel.EntityName, id)
		}
		return nil, common.ErrCannotGetEntity(postmodel.EntityName, err)
	}

	// Trả về bài viết tìm thấy
	return &post, nil
}
