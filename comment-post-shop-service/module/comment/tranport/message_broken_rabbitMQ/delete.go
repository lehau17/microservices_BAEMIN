package messagebrokenrabbitmq

import (
	"comment-post-shop-service/common"
	httpstatus "comment-post-shop-service/common/http_status"
	appcontext "comment-post-shop-service/component/app_context"
	"comment-post-shop-service/component/publish"
	commentbiz "comment-post-shop-service/module/comment/biz"
	commentstorage "comment-post-shop-service/module/comment/storage"
	"context"
	"encoding/json"

	"github.com/streadway/amqp"
)

func DeleteComment(appCtx appcontext.AppContext, data int64, d *amqp.Delivery) {
	ch := appCtx.GetChannel()
	storage := commentstorage.NewSqlStorage(appCtx.GetMainDBConnection())
	biz := commentbiz.NewDeleteCommentBiz(storage)
	var response []byte
	id, err := biz.Delete(context.Background(), data)
	if err != nil {
		errorResponse, ok := err.(common.RpcErrorResponse)
		if ok {
			response, _ = json.Marshal(errorResponse)
		} else {
			errorResponse = common.NewErrorRpcResponse(httpstatus.StatusInternalServerError, err)
			response, _ = json.Marshal(errorResponse)
		}
		publish.PublishMessage("", d.ReplyTo, d.CorrelationId, false, false, response, ch)
	} else {
		response, _ = json.Marshal(map[string]interface{}{"id": id})
		publish.PublishMessage("", d.ReplyTo, d.CorrelationId, false, false, response, ch)
	}

}
