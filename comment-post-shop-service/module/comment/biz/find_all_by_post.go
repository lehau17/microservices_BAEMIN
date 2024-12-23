package commentbiz

import (
	"comment-post-shop-service/common/paging"
	commentmodel "comment-post-shop-service/module/comment/model"
	"context"
)

type FindAllByShopStorage interface {
	FindAllByPost(ctx context.Context, paging *paging.Paging, post_id int64) ([]commentmodel.Comment, error)
}

type findAllByPostBiz struct {
	store FindAllByShopStorage
}

func NewFindAllByShopStorage(store FindAllByShopStorage) *findAllByPostBiz {
	return &findAllByPostBiz{store: store}
}

func (b *findAllByPostBiz) FindAllByPost(ctx context.Context, paging *paging.Paging, post_id int64) ([]commentmodel.Comment, error) {
	return b.store.FindAllByPost(ctx, paging, post_id)
}
