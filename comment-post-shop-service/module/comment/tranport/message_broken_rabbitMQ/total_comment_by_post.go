package messagebrokenrabbitmq

import (
	"comment-post-shop-service/common"
	appcontext "comment-post-shop-service/component/app_context"
	"comment-post-shop-service/component/publish"
	commentbiz "comment-post-shop-service/module/comment/biz"
	commentstorage "comment-post-shop-service/module/comment/storage"
	"context"
	"encoding/json"

	"github.com/streadway/amqp"
)

func TotalCountCommentByPost(appCtx appcontext.AppContext, post_id int64, d *amqp.Delivery) {
	ch := appCtx.GetChannel()
	storage := commentstorage.NewSqlStorage(appCtx.GetMainDBConnection())
	biz := commentbiz.NewCountCommentCreateBiz(storage)
	var response []byte
	count, err := biz.CountCommentByPost(context.Background(), post_id)
	if err != nil {
		errorResponse := common.NewSqlErrorResponse(err)
		response, _ := json.Marshal(errorResponse)
		publish.PublishMessage("", d.ReplyTo, d.CorrelationId, false, false, response, ch)
	} else {
		response, _ = json.Marshal(count)
		publish.PublishMessage("", d.ReplyTo, d.CorrelationId, false, false, response, ch)
	}

}
