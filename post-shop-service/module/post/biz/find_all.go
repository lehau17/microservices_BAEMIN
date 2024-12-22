package postbiz

import (
	"context"
	postmodel "post-shop-service/module/post/model"
)

type FindAllPostStorage interface {
	FindAll(ctx context.Context) ([]postmodel.Post, error)
}

type findAllPostBiz struct {
	store FindAllPostStorage
}

func NewFindAllPostBiz(store FindAllPostStorage) *findAllPostBiz {
	return &findAllPostBiz{store: store}
}

func (biz *findAllPostBiz) FindAll(ctx context.Context) ([]postmodel.Post, error) {
	posts, err := biz.store.FindAll(ctx)
	if err != nil {
		return nil, err
	}

	return posts, nil
}
