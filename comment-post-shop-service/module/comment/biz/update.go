package commentbiz

import (
	commentmodel "comment-post-shop-service/module/comment/model"
	"context"
)

type UpdateCommentStorage interface {
	UpdateComment(ctx context.Context, data *commentmodel.CommentUpdate) (*commentmodel.Comment, error)
}

type commentUpdateBiz struct {
	store UpdateCommentStorage
}

func NewCommentUpdateBiz(
	store UpdateCommentStorage,
) *commentUpdateBiz {
	return &commentUpdateBiz{store: store}
}

func (b *commentUpdateBiz) UpdateComment(ctx context.Context, data *commentmodel.CommentUpdate) (*commentmodel.Comment, error) {
	return b.store.UpdateComment(ctx, comment)
}
