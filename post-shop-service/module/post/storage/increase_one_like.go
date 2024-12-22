package poststorage

import (
	"context"
	"errors"
	"post-shop-service/common"
	httpstatus "post-shop-service/common/http_status"
)

func (s *sqlStore) IncreaseLike(ctx context.Context, postID int) error {
	query := `UPDATE post
		SET total_like = total_like + 1
		WHERE id = ? and status = 'published'`
	result, err := s.db.ExecContext(ctx, query, postID)
	rowAffect, _ := result.RowsAffected()
	if err != nil {
		return common.NewErrorRpcResponse(httpstatus.StatusInternalServerError, err)
	}
	if rowAffect <= 0 {
		return common.NewErrorRpcResponse(httpstatus.StatusBadRequest, errors.New("not found post"))
	}

	return nil
}
