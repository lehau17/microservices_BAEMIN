package postbiz

import (
	"context"
	"post-shop-service/common/paging"
	postmodel "post-shop-service/module/post/model"
)

type FindAllByShopStorage interface {
	FindAllByShop(ctx context.Context, paging *paging.Paging, shopID int) ([]postmodel.Post, error)
}

type findAllByShopBiz struct {
	store FindAllByShopStorage
}

func NewFindAllByShopBiz(store FindAllByShopStorage) *findAllByShopBiz {
	return &findAllByShopBiz{store: store}
}

func (biz *findAllByShopBiz) FindAllByShop(ctx context.Context, paging *paging.Paging, shopID int) ([]postmodel.Post, error) {
	posts, err := biz.store.FindAllByShop(ctx, paging, shopID)
	if err != nil {
		return nil, err
	}

	return posts, nil
}
