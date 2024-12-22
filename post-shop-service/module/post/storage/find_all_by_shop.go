package poststorage

import (
	"context"
	"post-shop-service/common"
	httpstatus "post-shop-service/common/http_status"
	"post-shop-service/common/paging"
	postmodel "post-shop-service/module/post/model"
)

func (s *sqlStore) FindAllByShop(ctx context.Context, paging *paging.Paging, shopID int) ([]postmodel.Post, error) {
	var posts []postmodel.Post
	query := `SELECT * FROM post WHERE shop_id = ?`
	args := []interface{}{shopID}

	// Apply cursor-based pagination if cursor is provided
	if paging != nil {
		if paging.Cursor != nil {
			query += ` AND id < ?`
			args = append(args, *paging.Cursor)
		}
		query += ` ORDER BY id DESC`

		// Add LIMIT for both cursor and offset-based pagination
		query += ` LIMIT ?`
		args = append(args, paging.Limit)
	} else {
		query += ` ORDER BY id DESC`
	}

	// If offset-based pagination (no cursor), add OFFSET
	if paging != nil && paging.Cursor == nil {
		query += ` OFFSET ?`
		args = append(args, (paging.Page-1)*paging.Limit)
	}

	// Execute query
	err := s.db.SelectContext(ctx, &posts, query, args...)
	if err != nil {
		return nil, common.NewErrorRpcResponse(httpstatus.StatusInternalServerError, err)
	}
	return posts, nil
}
