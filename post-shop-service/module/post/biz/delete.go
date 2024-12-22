package postbiz

import "context"

type DeletePostStorage interface {
	DeletePost(ctx context.Context, postID int64) error
}

type deletePostBiz struct {
	store DeletePostStorage
}

func NewDeletePostBiz(store DeletePostStorage) *deletePostBiz {
	return &deletePostBiz{store: store}
}

func (biz *deletePostBiz) DeletePost(ctx context.Context, postID int64) error {
	if err := biz.store.DeletePost(ctx, postID); err != nil {
		return err
	}

	return nil
}
