package poststorage

import (
	"context"
	"post-shop-service/common"
	httpstatus "post-shop-service/common/http_status"
)

func (s *sqlStore) DescreaseLike(ctx context.Context, postID int) error {
	query := `UPDATE post
		SET total_like = total_like - 1
		WHERE id = ? and status = 'published'`
	result, err := s.db.ExecContext(ctx, query, postID)
	if err != nil {

		return common.NewErrorRpcResponse(httpstatus.StatusInternalServerError, err)
	}
	rowAffect, _ := result.RowsAffected()
	if rowAffect == 0 {
		return common.NewErrorRpcResponse(httpstatus.StatusBadRequest, err)
	}
	return nil
}
