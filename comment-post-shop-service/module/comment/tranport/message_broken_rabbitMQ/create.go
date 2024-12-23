package messagebrokenrabbitmq

import (
	"comment-post-shop-service/common"
	appcontext "comment-post-shop-service/component/app_context"
	"comment-post-shop-service/component/publish"
	commentbiz "comment-post-shop-service/module/comment/biz"
	commentmodel "comment-post-shop-service/module/comment/model"
	commentstorage "comment-post-shop-service/module/comment/storage"
	"context"
	"encoding/json"

	"github.com/streadway/amqp"
)

func CreatePost(appCtx appcontext.AppContext, data *commentmodel.CommentCreate, d *amqp.Delivery) {
	ch := appCtx.GetChannel()
	storage := commentstorage.NewSqlStorage(appCtx.GetMainDBConnection())
	biz := commentbiz.NewCommentCreateBiz(storage)
	var response []byte
	id, err := biz.CreateComment(context.Background(), data)
	if err != nil {
		errorResponse := common.NewSqlErrorResponse(err)
		response, _ := json.Marshal(errorResponse)
		publish.PublishMessage("", d.ReplyTo, d.CorrelationId, false, false, response, ch)
	} else {
		response, _ = json.Marshal(map[string]interface{}{"id": id})
		publish.PublishMessage("", d.ReplyTo, d.CorrelationId, false, false, response, ch)
	}

}
