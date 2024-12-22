package poststorage

import (
	"context"
	"fmt"
	"post-shop-service/common"
	httpstatus "post-shop-service/common/http_status"
	"post-shop-service/common/paging"
	postmodel "post-shop-service/module/post/model"
)

func (s *sqlStore) FindAll(ctx context.Context, paging *paging.Paging) ([]postmodel.Post, error) {
	fmt.Printf("paging ở storage: %v\n", paging)
	var posts []postmodel.Post
	query := `SELECT * FROM post`
	args := []interface{}{}

	// Apply cursor-based pagination if cursor is provided
	if paging != nil {
		if paging.Cursor != nil {
			fmt.Printf("Cursor: %v\n", *paging.Cursor)
			query += ` WHERE id < ?`
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
		return nil, common.NewErrorRpcResponse(httpstatus.StatusBadRequest, err)
	}

	return posts, nil
}
