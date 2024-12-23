package commentbiz

import "context"

type DeleteCommentStorage interface {
	Delete(ctx context.Context, commentID int64) (int64, error)
}

type deleteCommentBiz struct {
	store DeleteCommentStorage
}

func NewDeleteCommentBiz(store DeleteCommentStorage) *deleteCommentBiz {
	return &deleteCommentBiz{store: store}
}

func (b *deleteCommentBiz) Delete(ctx context.Context, commentID int64) (int64, error) {
	return b.store.DeleteComment(ctx, commentID)
}
