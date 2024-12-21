package postbiz

import (
	"context"
	postmodel "post-shop-service/module/post/model"
)

type PostCreateStorage interface {
	CreatePost(ctx context.Context, data *postmodel.CreatePost) (int64, error)
}

type FoodCreateBiz struct {
	storage PostCreateStorage
}

func NewFoodCreateBiz(storage PostCreateStorage) *FoodCreateBiz {
	return &FoodCreateBiz{storage: storage}
}

func (b *FoodCreateBiz) CreatePost(ctx context.Context, data *postmodel.CreatePost) (int64, error) {
	id, err := b.storage.CreatePost(ctx, data)
	if err != nil {
		return 0, err
	}
	return id, nil
}
