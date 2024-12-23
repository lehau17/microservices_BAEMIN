package messagebrokenrabbitmq

import (
	"comment-post-shop-service/common"
	httpstatus "comment-post-shop-service/common/http_status"
	appcontext "comment-post-shop-service/component/app_context"
	"comment-post-shop-service/component/publish"
	commentbiz "comment-post-shop-service/module/comment/biz"
	commentmodel "comment-post-shop-service/module/comment/model"
	commentstorage "comment-post-shop-service/module/comment/storage"
	"context"
	"encoding/json"

	"github.com/streadway/amqp"
)

func UpdateComment(appCtx appcontext.AppContext, data *commentmodel.CommentUpdate, d *amqp.Delivery) {
	ch := appCtx.GetChannel()
	storage := commentstorage.NewSqlStorage(appCtx.GetMainDBConnection())
	biz := commentbiz.NewCommentUpdateBiz(storage)
	var response []byte
	comment, err := biz.UpdateComment(context.Background(), data)
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
		response, _ = json.Marshal(comment)
		publish.PublishMessage("", d.ReplyTo, d.CorrelationId, false, false, response, ch)
	}

}
