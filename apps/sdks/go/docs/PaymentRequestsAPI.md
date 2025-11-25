# \PaymentRequestsAPI

All URIs are relative to *https://api.lomi.africa/v1*

Method | HTTP request | Description
------------- | ------------- | -------------
[**CreatePaymentRequest**](PaymentRequestsAPI.md#CreatePaymentRequest) | **Post** /payment_requests | Create payment request
[**DeletePaymentRequest**](PaymentRequestsAPI.md#DeletePaymentRequest) | **Delete** /payment_requests/{request_id} | Delete payment request
[**ListPaymentRequests**](PaymentRequestsAPI.md#ListPaymentRequests) | **Get** /payment_requests | List payment requests
[**RetrievePaymentRequest**](PaymentRequestsAPI.md#RetrievePaymentRequest) | **Get** /payment_requests/{request_id} | Retrieve payment request
[**UpdatePaymentRequest**](PaymentRequestsAPI.md#UpdatePaymentRequest) | **Patch** /payment_requests/{request_id} | Update payment request



## CreatePaymentRequest

> PaymentRequests CreatePaymentRequest(ctx).PaymentRequestsCreate(paymentRequestsCreate).Execute()

Create payment request



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
	paymentRequestsCreate := *openapiclient.NewPaymentRequestsCreate() // PaymentRequestsCreate | 

	configuration := openapiclient.NewConfiguration()
	apiClient := openapiclient.NewAPIClient(configuration)
	resp, r, err := apiClient.PaymentRequestsAPI.CreatePaymentRequest(context.Background()).PaymentRequestsCreate(paymentRequestsCreate).Execute()
	if err != nil {
		fmt.Fprintf(os.Stderr, "Error when calling `PaymentRequestsAPI.CreatePaymentRequest``: %v\n", err)
		fmt.Fprintf(os.Stderr, "Full HTTP response: %v\n", r)
	}
	// response from `CreatePaymentRequest`: PaymentRequests
	fmt.Fprintf(os.Stdout, "Response from `PaymentRequestsAPI.CreatePaymentRequest`: %v\n", resp)
}
```

### Path Parameters



### Other Parameters

Other parameters are passed through a pointer to a apiCreatePaymentRequestRequest struct via the builder pattern


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **paymentRequestsCreate** | [**PaymentRequestsCreate**](PaymentRequestsCreate.md) |  | 

### Return type

[**PaymentRequests**](PaymentRequests.md)

### Authorization

[ApiKeyAuth](../README.md#ApiKeyAuth)

### HTTP request headers

- **Content-Type**: application/json
- **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints)
[[Back to Model list]](../README.md#documentation-for-models)
[[Back to README]](../README.md)


## DeletePaymentRequest

> DeletePaymentRequest(ctx, requestId).Execute()

Delete payment request



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
	requestId := "38400000-8cf0-11bd-b23e-10b96e4ef00d" // string | Unique identifier for the payment request

	configuration := openapiclient.NewConfiguration()
	apiClient := openapiclient.NewAPIClient(configuration)
	r, err := apiClient.PaymentRequestsAPI.DeletePaymentRequest(context.Background(), requestId).Execute()
	if err != nil {
		fmt.Fprintf(os.Stderr, "Error when calling `PaymentRequestsAPI.DeletePaymentRequest``: %v\n", err)
		fmt.Fprintf(os.Stderr, "Full HTTP response: %v\n", r)
	}
}
```

### Path Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
**ctx** | **context.Context** | context for authentication, logging, cancellation, deadlines, tracing, etc.
**requestId** | **string** | Unique identifier for the payment request | 

### Other Parameters

Other parameters are passed through a pointer to a apiDeletePaymentRequestRequest struct via the builder pattern


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


## ListPaymentRequests

> ListPaymentRequests200Response ListPaymentRequests(ctx).Limit(limit).Offset(offset).Sort(sort).Execute()

List payment requests



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
	resp, r, err := apiClient.PaymentRequestsAPI.ListPaymentRequests(context.Background()).Limit(limit).Offset(offset).Sort(sort).Execute()
	if err != nil {
		fmt.Fprintf(os.Stderr, "Error when calling `PaymentRequestsAPI.ListPaymentRequests``: %v\n", err)
		fmt.Fprintf(os.Stderr, "Full HTTP response: %v\n", r)
	}
	// response from `ListPaymentRequests`: ListPaymentRequests200Response
	fmt.Fprintf(os.Stdout, "Response from `PaymentRequestsAPI.ListPaymentRequests`: %v\n", resp)
}
```

### Path Parameters



### Other Parameters

Other parameters are passed through a pointer to a apiListPaymentRequestsRequest struct via the builder pattern


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **limit** | **int32** | Maximum number of items to return (1-100) | [default to 20]
 **offset** | **int32** | Number of items to skip for pagination | [default to 0]
 **sort** | **string** | Sort order. Format: &#x60;field:direction&#x60; (e.g., &#x60;created_at:desc&#x60;) | 

### Return type

[**ListPaymentRequests200Response**](ListPaymentRequests200Response.md)

### Authorization

[ApiKeyAuth](../README.md#ApiKeyAuth)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints)
[[Back to Model list]](../README.md#documentation-for-models)
[[Back to README]](../README.md)


## RetrievePaymentRequest

> PaymentRequests RetrievePaymentRequest(ctx, requestId).Execute()

Retrieve payment request



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
	requestId := "38400000-8cf0-11bd-b23e-10b96e4ef00d" // string | Unique identifier for the payment request

	configuration := openapiclient.NewConfiguration()
	apiClient := openapiclient.NewAPIClient(configuration)
	resp, r, err := apiClient.PaymentRequestsAPI.RetrievePaymentRequest(context.Background(), requestId).Execute()
	if err != nil {
		fmt.Fprintf(os.Stderr, "Error when calling `PaymentRequestsAPI.RetrievePaymentRequest``: %v\n", err)
		fmt.Fprintf(os.Stderr, "Full HTTP response: %v\n", r)
	}
	// response from `RetrievePaymentRequest`: PaymentRequests
	fmt.Fprintf(os.Stdout, "Response from `PaymentRequestsAPI.RetrievePaymentRequest`: %v\n", resp)
}
```

### Path Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
**ctx** | **context.Context** | context for authentication, logging, cancellation, deadlines, tracing, etc.
**requestId** | **string** | Unique identifier for the payment request | 

### Other Parameters

Other parameters are passed through a pointer to a apiRetrievePaymentRequestRequest struct via the builder pattern


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------


### Return type

[**PaymentRequests**](PaymentRequests.md)

### Authorization

[ApiKeyAuth](../README.md#ApiKeyAuth)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints)
[[Back to Model list]](../README.md#documentation-for-models)
[[Back to README]](../README.md)


## UpdatePaymentRequest

> PaymentRequests UpdatePaymentRequest(ctx, requestId).PaymentRequestsUpdate(paymentRequestsUpdate).Execute()

Update payment request



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
	requestId := "38400000-8cf0-11bd-b23e-10b96e4ef00d" // string | Unique identifier for the payment request
	paymentRequestsUpdate := *openapiclient.NewPaymentRequestsUpdate() // PaymentRequestsUpdate | 

	configuration := openapiclient.NewConfiguration()
	apiClient := openapiclient.NewAPIClient(configuration)
	resp, r, err := apiClient.PaymentRequestsAPI.UpdatePaymentRequest(context.Background(), requestId).PaymentRequestsUpdate(paymentRequestsUpdate).Execute()
	if err != nil {
		fmt.Fprintf(os.Stderr, "Error when calling `PaymentRequestsAPI.UpdatePaymentRequest``: %v\n", err)
		fmt.Fprintf(os.Stderr, "Full HTTP response: %v\n", r)
	}
	// response from `UpdatePaymentRequest`: PaymentRequests
	fmt.Fprintf(os.Stdout, "Response from `PaymentRequestsAPI.UpdatePaymentRequest`: %v\n", resp)
}
```

### Path Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
**ctx** | **context.Context** | context for authentication, logging, cancellation, deadlines, tracing, etc.
**requestId** | **string** | Unique identifier for the payment request | 

### Other Parameters

Other parameters are passed through a pointer to a apiUpdatePaymentRequestRequest struct via the builder pattern


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------

 **paymentRequestsUpdate** | [**PaymentRequestsUpdate**](PaymentRequestsUpdate.md) |  | 

### Return type

[**PaymentRequests**](PaymentRequests.md)

### Authorization

[ApiKeyAuth](../README.md#ApiKeyAuth)

### HTTP request headers

- **Content-Type**: application/json
- **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints)
[[Back to Model list]](../README.md#documentation-for-models)
[[Back to README]](../README.md)

