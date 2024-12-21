package poststorage

import (
	"context"
	postmodel "post-shop-service/module/post/model"
)

func (s *sqlStore) CreatePost(ctx context.Context, data *postmodel.CreatePost) (int64, error) {
	query := `
		INSERT INTO post (title, content, shop_id,  hashtag, status)
		VALUES (:title, :content, :shop_id, :hashtag, :status)
	`
	result, err := s.db.NamedExec(query, data)
	id, _ := result.LastInsertId()
	return id, err
}
