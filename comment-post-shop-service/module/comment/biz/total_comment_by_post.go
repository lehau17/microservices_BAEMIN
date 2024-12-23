package commentbiz

import "context"

type CountCommentByPostStorage interface {
	CountCommentByPost(ctx context.Context, post_id int64) (int64, error)
}

type countCommentByPostBiz struct {
	store CountCommentByPostStorage
}

func NewCountCommentCreateBiz(store CountCommentByPostStorage) *countCommentByPostBiz {
	return &countCommentByPostBiz{store: store}
}

func (c *countCommentByPostBiz) CountCommentByPost(ctx context.Context, post_id int64) (int64, error) {
	return c.store.CountCommentByPost(ctx, post_id)
}
