package postbiz

import (
	"context"
	postmodel "post-shop-service/module/post/model"
)

type PostCreateStorage interface {
	CreatePost(ctx context.Context, data *postmodel.CreatePost) error
}


type FoodCreateBiz struct {
	storage PostCreateStorage
}


func NewFoodCreateBiz(storage  PostCreateStorage) (*FoodCreateBiz) {
	return &FoodCreateBiz{storage: storage}
}


func (b *FoodCreateBiz) CreatePost(ctx context.Context, data *postmodel.CreatePost) error {
	if err := b.storage.CreatePost(ctx, data); err != nil {
		return err
	}
	return nil
}