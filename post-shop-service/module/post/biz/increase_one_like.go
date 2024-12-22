package postbiz

import (
	"context"
)

type IncreaseLikePostStorage interface {
	IncreaseLike(ctx context.Context, postID int) error
}

type increaseLikePostBiz struct {
	store IncreaseLikePostStorage
}

func NewIncreaseLikePostBiz(store IncreaseLikePostStorage) *increaseLikePostBiz {
	return &increaseLikePostBiz{store: store}
}

func (biz *increaseLikePostBiz) IncreaseLike(ctx context.Context, postID int) error {
	return biz.store.IncreaseLike(ctx, postID)
}
