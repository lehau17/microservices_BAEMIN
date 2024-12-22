package postbiz

import "context"

type DescreaseLikePostStorage interface {
	DescreaseLike(ctx context.Context, postID int) error
}

type descreaseLikePostBiz struct {
	store DescreaseLikePostStorage
}

func NewDescreaseLikePostBiz(store DescreaseLikePostStorage) *descreaseLikePostBiz {
	return &descreaseLikePostBiz{store: store}
}

func (biz *descreaseLikePostBiz) DescreaseLike(ctx context.Context, postID int) error {
	return biz.store.DescreaseLike(ctx, postID)
}
