package commentbiz

import (
	commentmodel "comment-post-shop-service/module/comment/model"
	"context"
)

type CreateCommentStorage interface {
	Create(ctx context.Context, comment *commentmodel.CommentCreate) (int64, error)
}

type commentCreateBiz struct {
	store CreateCommentStorage
}

func NewCommentCreateBiz(
	store CreateCommentStorage,
) *commentCreateBiz {
	return &commentCreateBiz{store: store}
}

func (b *commentCreateBiz) CreateComment(ctx context.Context, comment *commentmodel.CommentCreate) (int64, error) {
	return b.store.Create(ctx, comment)
}
