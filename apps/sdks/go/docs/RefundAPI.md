# \RefundAPI

All URIs are relative to *https://api.lomi.africa/v1*

Method | HTTP request | Description
------------- | ------------- | -------------
[**RefundsGet**](RefundAPI.md#RefundsGet) | **Get** /refunds | List refunds
[**RefundsPost**](RefundAPI.md#RefundsPost) | **Post** /refunds | Create refund
[**RefundsRefundIdDelete**](RefundAPI.md#RefundsRefundIdDelete) | **Delete** /refunds/{refund_id} | Delete refund
[**RefundsRefundIdGet**](RefundAPI.md#RefundsRefundIdGet) | **Get** /refunds/{refund_id} | Get refund
[**RefundsRefundIdPatch**](RefundAPI.md#RefundsRefundIdPatch) | **Patch** /refunds/{refund_id} | Update refund



## RefundsGet

> RefundsGet200Response RefundsGet(ctx).Limit(limit).Offset(offset).Sort(sort).Execute()

List refunds



### Example

```go
package main

import (
	"context"
	"fmt"
	"os"
	openapiclient "github.com/lomiafrica/lomi-go-sdk"
)

func main() {
	limit := int32(56) // int32 | Maximum number of items to return (optional) (default to 20)
	offset := int32(56) // int32 | Number of items to skip (optional) (default to 0)
	sort := "sort_example" // string | Sort order (e.g., created_at:desc) (optional)

	configuration := openapiclient.NewConfiguration()
	apiClient := openapiclient.NewAPIClient(configuration)
	resp, r, err := apiClient.RefundAPI.RefundsGet(context.Background()).Limit(limit).Offset(offset).Sort(sort).Execute()
	if err != nil {
		fmt.Fprintf(os.Stderr, "Error when calling `RefundAPI.RefundsGet``: %v\n", err)
		fmt.Fprintf(os.Stderr, "Full HTTP response: %v\n", r)
	}
	// response from `RefundsGet`: RefundsGet200Response
	fmt.Fprintf(os.Stdout, "Response from `RefundAPI.RefundsGet`: %v\n", resp)
}
```

### Path Parameters



### Other Parameters

Other parameters are passed through a pointer to a apiRefundsGetRequest struct via the builder pattern


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **limit** | **int32** | Maximum number of items to return | [default to 20]
 **offset** | **int32** | Number of items to skip | [default to 0]
 **sort** | **string** | Sort order (e.g., created_at:desc) | 

### Return type

[**RefundsGet200Response**](RefundsGet200Response.md)

### Authorization

[ApiKeyAuth](../README.md#ApiKeyAuth)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints)
[[Back to Model list]](../README.md#documentation-for-models)
[[Back to README]](../README.md)


## RefundsPost

> Refunds RefundsPost(ctx).RefundsCreate(refundsCreate).Execute()

Create refund



### Example

```go
package main

import (
	"context"
	"fmt"
	"os"
	openapiclient "github.com/lomiafrica/lomi-go-sdk"
)

func main() {
	refundsCreate := *openapiclient.NewRefundsCreate() // RefundsCreate | 

	configuration := openapiclient.NewConfiguration()
	apiClient := openapiclient.NewAPIClient(configuration)
	resp, r, err := apiClient.RefundAPI.RefundsPost(context.Background()).RefundsCreate(refundsCreate).Execute()
	if err != nil {
		fmt.Fprintf(os.Stderr, "Error when calling `RefundAPI.RefundsPost``: %v\n", err)
		fmt.Fprintf(os.Stderr, "Full HTTP response: %v\n", r)
	}
	// response from `RefundsPost`: Refunds
	fmt.Fprintf(os.Stdout, "Response from `RefundAPI.RefundsPost`: %v\n", resp)
}
```

### Path Parameters



### Other Parameters

Other parameters are passed through a pointer to a apiRefundsPostRequest struct via the builder pattern


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **refundsCreate** | [**RefundsCreate**](RefundsCreate.md) |  | 

### Return type

[**Refunds**](Refunds.md)

### Authorization

[ApiKeyAuth](../README.md#ApiKeyAuth)

### HTTP request headers

- **Content-Type**: application/json
- **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints)
[[Back to Model list]](../README.md#documentation-for-models)
[[Back to README]](../README.md)


## RefundsRefundIdDelete

> RefundsRefundIdDelete(ctx, refundId).Execute()

Delete refund



### Example

```go
package main

import (
	"context"
	"fmt"
	"os"
	openapiclient "github.com/lomiafrica/lomi-go-sdk"
)

func main() {
	refundId := "38400000-8cf0-11bd-b23e-10b96e4ef00d" // string | The refund ID

	configuration := openapiclient.NewConfiguration()
	apiClient := openapiclient.NewAPIClient(configuration)
	r, err := apiClient.RefundAPI.RefundsRefundIdDelete(context.Background(), refundId).Execute()
	if err != nil {
		fmt.Fprintf(os.Stderr, "Error when calling `RefundAPI.RefundsRefundIdDelete``: %v\n", err)
		fmt.Fprintf(os.Stderr, "Full HTTP response: %v\n", r)
	}
}
```

### Path Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
**ctx** | **context.Context** | context for authentication, logging, cancellation, deadlines, tracing, etc.
**refundId** | **string** | The refund ID | 

### Other Parameters

Other parameters are passed through a pointer to a apiRefundsRefundIdDeleteRequest struct via the builder pattern


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------


### Return type

 (empty response body)

### Authorization

[ApiKeyAuth](../README.md#ApiKeyAuth)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints)
[[Back to Model list]](../README.md#documentation-for-models)
[[Back to README]](../README.md)


## RefundsRefundIdGet

> Refunds RefundsRefundIdGet(ctx, refundId).Execute()

Get refund



### Example

```go
package main

import (
	"context"
	"fmt"
	"os"
	openapiclient "github.com/lomiafrica/lomi-go-sdk"
)

func main() {
	refundId := "38400000-8cf0-11bd-b23e-10b96e4ef00d" // string | The refund ID

	configuration := openapiclient.NewConfiguration()
	apiClient := openapiclient.NewAPIClient(configuration)
	resp, r, err := apiClient.RefundAPI.RefundsRefundIdGet(context.Background(), refundId).Execute()
	if err != nil {
		fmt.Fprintf(os.Stderr, "Error when calling `RefundAPI.RefundsRefundIdGet``: %v\n", err)
		fmt.Fprintf(os.Stderr, "Full HTTP response: %v\n", r)
	}
	// response from `RefundsRefundIdGet`: Refunds
	fmt.Fprintf(os.Stdout, "Response from `RefundAPI.RefundsRefundIdGet`: %v\n", resp)
}
```

### Path Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
**ctx** | **context.Context** | context for authentication, logging, cancellation, deadlines, tracing, etc.
**refundId** | **string** | The refund ID | 

### Other Parameters

Other parameters are passed through a pointer to a apiRefundsRefundIdGetRequest struct via the builder pattern


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------


### Return type

[**Refunds**](Refunds.md)

### Authorization

[ApiKeyAuth](../README.md#ApiKeyAuth)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints)
[[Back to Model list]](../README.md#documentation-for-models)
[[Back to README]](../README.md)


## RefundsRefundIdPatch

> Refunds RefundsRefundIdPatch(ctx, refundId).RefundsUpdate(refundsUpdate).Execute()

Update refund



### Example

```go
package main

import (
	"context"
	"fmt"
	"os"
	openapiclient "github.com/lomiafrica/lomi-go-sdk"
)

func main() {
	refundId := "38400000-8cf0-11bd-b23e-10b96e4ef00d" // string | The refund ID
	refundsUpdate := *openapiclient.NewRefundsUpdate() // RefundsUpdate | 

	configuration := openapiclient.NewConfiguration()
	apiClient := openapiclient.NewAPIClient(configuration)
	resp, r, err := apiClient.RefundAPI.RefundsRefundIdPatch(context.Background(), refundId).RefundsUpdate(refundsUpdate).Execute()
	if err != nil {
		fmt.Fprintf(os.Stderr, "Error when calling `RefundAPI.RefundsRefundIdPatch``: %v\n", err)
		fmt.Fprintf(os.Stderr, "Full HTTP response: %v\n", r)
	}
	// response from `RefundsRefundIdPatch`: Refunds
	fmt.Fprintf(os.Stdout, "Response from `RefundAPI.RefundsRefundIdPatch`: %v\n", resp)
}
```

### Path Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
**ctx** | **context.Context** | context for authentication, logging, cancellation, deadlines, tracing, etc.
**refundId** | **string** | The refund ID | 

### Other Parameters

Other parameters are passed through a pointer to a apiRefundsRefundIdPatchRequest struct via the builder pattern


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------

 **refundsUpdate** | [**RefundsUpdate**](RefundsUpdate.md) |  | 

### Return type

[**Refunds**](Refunds.md)

### Authorization

[ApiKeyAuth](../README.md#ApiKeyAuth)

### HTTP request headers

- **Content-Type**: application/json
- **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints)
[[Back to Model list]](../README.md#documentation-for-models)
[[Back to README]](../README.md)

