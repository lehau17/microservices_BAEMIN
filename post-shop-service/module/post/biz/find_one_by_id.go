package postbiz

import (
	"context"
	postmodel "post-shop-service/module/post/model"
)

type FindOnePostStorage interface {
	FindOne(ctx context.Context, id int64) (*postmodel.Post, error)
}

type findOnePostBiz struct {
	store FindOnePostStorage
}

func NewFindOnePostBiz(store FindOnePostStorage) *findOnePostBiz {
	return &findOnePostBiz{store: store}
}

func (biz *findOnePostBiz) FindOne(ctx context.Context, id int64) (*postmodel.Post, error) {
	post, err := biz.store.FindOne(ctx, id)
	if err != nil {
		return nil, err
	}

	return post, nil
}
