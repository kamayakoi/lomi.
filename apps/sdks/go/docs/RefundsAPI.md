# \RefundsAPI

All URIs are relative to *https://api.lomi.africa/v1*

Method | HTTP request | Description
------------- | ------------- | -------------
[**CreateRefund**](RefundsAPI.md#CreateRefund) | **Post** /refunds | Create refund
[**DeleteRefund**](RefundsAPI.md#DeleteRefund) | **Delete** /refunds/{refund_id} | Delete refund
[**ListRefunds**](RefundsAPI.md#ListRefunds) | **Get** /refunds | List refunds
[**RetrieveRefund**](RefundsAPI.md#RetrieveRefund) | **Get** /refunds/{refund_id} | Retrieve refund
[**UpdateRefund**](RefundsAPI.md#UpdateRefund) | **Patch** /refunds/{refund_id} | Update refund



## CreateRefund

> Refunds CreateRefund(ctx).RefundsCreate(refundsCreate).Execute()

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
	resp, r, err := apiClient.RefundsAPI.CreateRefund(context.Background()).RefundsCreate(refundsCreate).Execute()
	if err != nil {
		fmt.Fprintf(os.Stderr, "Error when calling `RefundsAPI.CreateRefund``: %v\n", err)
		fmt.Fprintf(os.Stderr, "Full HTTP response: %v\n", r)
	}
	// response from `CreateRefund`: Refunds
	fmt.Fprintf(os.Stdout, "Response from `RefundsAPI.CreateRefund`: %v\n", resp)
}
```

### Path Parameters



### Other Parameters

Other parameters are passed through a pointer to a apiCreateRefundRequest struct via the builder pattern


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


## DeleteRefund

> DeleteRefund(ctx, refundId).Execute()

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
	refundId := "38400000-8cf0-11bd-b23e-10b96e4ef00d" // string | Unique identifier for the refund

	configuration := openapiclient.NewConfiguration()
	apiClient := openapiclient.NewAPIClient(configuration)
	r, err := apiClient.RefundsAPI.DeleteRefund(context.Background(), refundId).Execute()
	if err != nil {
		fmt.Fprintf(os.Stderr, "Error when calling `RefundsAPI.DeleteRefund``: %v\n", err)
		fmt.Fprintf(os.Stderr, "Full HTTP response: %v\n", r)
	}
}
```

### Path Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
**ctx** | **context.Context** | context for authentication, logging, cancellation, deadlines, tracing, etc.
**refundId** | **string** | Unique identifier for the refund | 

### Other Parameters

Other parameters are passed through a pointer to a apiDeleteRefundRequest struct via the builder pattern


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


## ListRefunds

> ListRefunds200Response ListRefunds(ctx).Limit(limit).Offset(offset).Sort(sort).Execute()

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
	limit := int32(56) // int32 | Maximum number of items to return (1-100) (optional) (default to 20)
	offset := int32(56) // int32 | Number of items to skip for pagination (optional) (default to 0)
	sort := "created_at:desc" // string | Sort order. Format: `field:direction` (e.g., `created_at:desc`) (optional)

	configuration := openapiclient.NewConfiguration()
	apiClient := openapiclient.NewAPIClient(configuration)
	resp, r, err := apiClient.RefundsAPI.ListRefunds(context.Background()).Limit(limit).Offset(offset).Sort(sort).Execute()
	if err != nil {
		fmt.Fprintf(os.Stderr, "Error when calling `RefundsAPI.ListRefunds``: %v\n", err)
		fmt.Fprintf(os.Stderr, "Full HTTP response: %v\n", r)
	}
	// response from `ListRefunds`: ListRefunds200Response
	fmt.Fprintf(os.Stdout, "Response from `RefundsAPI.ListRefunds`: %v\n", resp)
}
```

### Path Parameters



### Other Parameters

Other parameters are passed through a pointer to a apiListRefundsRequest struct via the builder pattern


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **limit** | **int32** | Maximum number of items to return (1-100) | [default to 20]
 **offset** | **int32** | Number of items to skip for pagination | [default to 0]
 **sort** | **string** | Sort order. Format: &#x60;field:direction&#x60; (e.g., &#x60;created_at:desc&#x60;) | 

### Return type

[**ListRefunds200Response**](ListRefunds200Response.md)

### Authorization

[ApiKeyAuth](../README.md#ApiKeyAuth)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints)
[[Back to Model list]](../README.md#documentation-for-models)
[[Back to README]](../README.md)


## RetrieveRefund

> Refunds RetrieveRefund(ctx, refundId).Execute()

Retrieve refund



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
	refundId := "38400000-8cf0-11bd-b23e-10b96e4ef00d" // string | Unique identifier for the refund

	configuration := openapiclient.NewConfiguration()
	apiClient := openapiclient.NewAPIClient(configuration)
	resp, r, err := apiClient.RefundsAPI.RetrieveRefund(context.Background(), refundId).Execute()
	if err != nil {
		fmt.Fprintf(os.Stderr, "Error when calling `RefundsAPI.RetrieveRefund``: %v\n", err)
		fmt.Fprintf(os.Stderr, "Full HTTP response: %v\n", r)
	}
	// response from `RetrieveRefund`: Refunds
	fmt.Fprintf(os.Stdout, "Response from `RefundsAPI.RetrieveRefund`: %v\n", resp)
}
```

### Path Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
**ctx** | **context.Context** | context for authentication, logging, cancellation, deadlines, tracing, etc.
**refundId** | **string** | Unique identifier for the refund | 

### Other Parameters

Other parameters are passed through a pointer to a apiRetrieveRefundRequest struct via the builder pattern


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


## UpdateRefund

> Refunds UpdateRefund(ctx, refundId).RefundsUpdate(refundsUpdate).Execute()

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
	refundId := "38400000-8cf0-11bd-b23e-10b96e4ef00d" // string | Unique identifier for the refund
	refundsUpdate := *openapiclient.NewRefundsUpdate() // RefundsUpdate | 

	configuration := openapiclient.NewConfiguration()
	apiClient := openapiclient.NewAPIClient(configuration)
	resp, r, err := apiClient.RefundsAPI.UpdateRefund(context.Background(), refundId).RefundsUpdate(refundsUpdate).Execute()
	if err != nil {
		fmt.Fprintf(os.Stderr, "Error when calling `RefundsAPI.UpdateRefund``: %v\n", err)
		fmt.Fprintf(os.Stderr, "Full HTTP response: %v\n", r)
	}
	// response from `UpdateRefund`: Refunds
	fmt.Fprintf(os.Stdout, "Response from `RefundsAPI.UpdateRefund`: %v\n", resp)
}
```

### Path Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
**ctx** | **context.Context** | context for authentication, logging, cancellation, deadlines, tracing, etc.
**refundId** | **string** | Unique identifier for the refund | 

### Other Parameters

Other parameters are passed through a pointer to a apiUpdateRefundRequest struct via the builder pattern


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

