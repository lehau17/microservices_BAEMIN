package poststorage

import (
	"context"
	postmodel "post-shop-service/module/post/model"
)

func(s *sqlStore) CreatePost(ctx context.Context, data *postmodel.CreatePost) (error) {
	query := `
		INSERT INTO post (title, content, shop_id,  hashtag, status)
		VALUES (:title, :content, :shop_id, :hashtag, :status)
	`
	_, err := s.db.NamedExec(query, data)
	return err
} 