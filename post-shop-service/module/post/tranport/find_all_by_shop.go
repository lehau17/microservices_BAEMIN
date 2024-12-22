package posttranport

import (
	"context"
	"encoding/json"
	"fmt"
	"post-shop-service/common"
	httpstatus "post-shop-service/common/http_status"
	"post-shop-service/common/paging"
	appcontext "post-shop-service/component/app_context"
	"post-shop-service/component/publish"
	postbiz "post-shop-service/module/post/biz"
	poststorage "post-shop-service/module/post/storage"

	"github.com/streadway/amqp"
)

func FindAllByShop(appCtx appcontext.AppContext, paging *paging.Paging, d *amqp.Delivery, shopId int) {
	ch := appCtx.GetChannel()
	storage := poststorage.NewSqlStore(appCtx.GetMainDBConnection())
	biz := postbiz.NewFindAllByShopBiz(storage)
	var response []byte
	fmt.Printf("shopId ở tranport: %v\n", shopId)
	post, err := biz.FindAllByShop(context.Background(), paging, shopId)
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
		response, _ = json.Marshal(post)
		publish.PublishMessage("", d.ReplyTo, d.CorrelationId, false, false, response, ch)
	}
}
