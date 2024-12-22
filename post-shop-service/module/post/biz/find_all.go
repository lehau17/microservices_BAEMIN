package postbiz

import (
	"context"
	"post-shop-service/common/paging"
	postmodel "post-shop-service/module/post/model"
)

type FindAllPostStorage interface {
	FindAll(ctx context.Context, paging *paging.Paging) ([]postmodel.Post, error)
}

type findAllPostBiz struct {
	store FindAllPostStorage
}

func NewFindAllPostBiz(store FindAllPostStorage) *findAllPostBiz {
	return &findAllPostBiz{store: store}
}

func (biz *findAllPostBiz) FindAll(ctx context.Context, paging *paging.Paging) ([]postmodel.Post, error) {
	posts, err := biz.store.FindAll(ctx, paging)
	if err != nil {
		return nil, err
	}

	return posts, nil
}
