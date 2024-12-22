package posttranport

import (
	"context"
	"encoding/json"
	"post-shop-service/common"
	"post-shop-service/common/paging"
	appcontext "post-shop-service/component/app_context"
	"post-shop-service/component/publish"
	postbiz "post-shop-service/module/post/biz"
	poststorage "post-shop-service/module/post/storage"

	"github.com/streadway/amqp"
)

func FindAllPost(appCtx appcontext.AppContext, paging *paging.Paging, d *amqp.Delivery) {
	ch := appCtx.GetChannel()
	storage := poststorage.NewSqlStore(appCtx.GetMainDBConnection())
	biz := postbiz.NewFindAllPostBiz(storage)
	var response []byte
	post, err := biz.FindAll(context.Background(), paging)
	if err != nil {
		errorResponse := common.NewErrorRpcResponse(400, err)
		response, _ := json.Marshal(errorResponse)
		publish.PublishMessage("", d.ReplyTo, d.CorrelationId, false, false, response, ch)
	} else {
		response, _ = json.Marshal(post)
		publish.PublishMessage("", d.ReplyTo, d.CorrelationId, false, false, response, ch)
	}

}
