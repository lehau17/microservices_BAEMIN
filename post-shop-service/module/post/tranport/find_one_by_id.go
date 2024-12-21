package posttranport

import (
	"context"
	"encoding/json"
	"post-shop-service/common"
	appcontext "post-shop-service/component/app_context"
	"post-shop-service/component/publish"
	postbiz "post-shop-service/module/post/biz"
	poststorage "post-shop-service/module/post/storage"

	"github.com/streadway/amqp"
)

func FindPost(appCtx appcontext.AppContext, data int64, d *amqp.Delivery) {
	ch := appCtx.GetChannel()
	storage := poststorage.NewSqlStore(appCtx.GetMainDBConnection())
	biz := postbiz.NewFindOnePostBiz(storage)
	var response []byte
	post, err := biz.FindOne(context.Background(), data)
	if err != nil {
		errorResponse := common.NewErrorRpcResponse(400, err)
		response, _ := json.Marshal(errorResponse)
		publish.PublishMessage("", d.ReplyTo, d.CorrelationId, false, false, response, ch)
	} else {
		response, _ = json.Marshal(post)
		publish.PublishMessage("", d.ReplyTo, d.CorrelationId, false, false, response, ch)
	}

}
