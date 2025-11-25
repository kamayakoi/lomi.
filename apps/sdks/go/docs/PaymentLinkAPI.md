# \PaymentLinkAPI

All URIs are relative to *https://api.lomi.africa/v1*

Method | HTTP request | Description
------------- | ------------- | -------------
[**PaymentLinksGet**](PaymentLinkAPI.md#PaymentLinksGet) | **Get** /payment_links | List payment_links
[**PaymentLinksLinkIdDelete**](PaymentLinkAPI.md#PaymentLinksLinkIdDelete) | **Delete** /payment_links/{link_id} | Delete payment_link
[**PaymentLinksLinkIdGet**](PaymentLinkAPI.md#PaymentLinksLinkIdGet) | **Get** /payment_links/{link_id} | Get payment_link
[**PaymentLinksLinkIdPatch**](PaymentLinkAPI.md#PaymentLinksLinkIdPatch) | **Patch** /payment_links/{link_id} | Update payment_link
[**PaymentLinksPost**](PaymentLinkAPI.md#PaymentLinksPost) | **Post** /payment_links | Create payment_link



## PaymentLinksGet

> PaymentLinksGet200Response PaymentLinksGet(ctx).Limit(limit).Offset(offset).Sort(sort).Execute()

List payment_links



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
	resp, r, err := apiClient.PaymentLinkAPI.PaymentLinksGet(context.Background()).Limit(limit).Offset(offset).Sort(sort).Execute()
	if err != nil {
		fmt.Fprintf(os.Stderr, "Error when calling `PaymentLinkAPI.PaymentLinksGet``: %v\n", err)
		fmt.Fprintf(os.Stderr, "Full HTTP response: %v\n", r)
	}
	// response from `PaymentLinksGet`: PaymentLinksGet200Response
	fmt.Fprintf(os.Stdout, "Response from `PaymentLinkAPI.PaymentLinksGet`: %v\n", resp)
}
```

### Path Parameters



### Other Parameters

Other parameters are passed through a pointer to a apiPaymentLinksGetRequest struct via the builder pattern


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **limit** | **int32** | Maximum number of items to return | [default to 20]
 **offset** | **int32** | Number of items to skip | [default to 0]
 **sort** | **string** | Sort order (e.g., created_at:desc) | 

### Return type

[**PaymentLinksGet200Response**](PaymentLinksGet200Response.md)

### Authorization

[ApiKeyAuth](../README.md#ApiKeyAuth)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints)
[[Back to Model list]](../README.md#documentation-for-models)
[[Back to README]](../README.md)


## PaymentLinksLinkIdDelete

> PaymentLinksLinkIdDelete(ctx, linkId).Execute()

Delete payment_link



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
	linkId := "38400000-8cf0-11bd-b23e-10b96e4ef00d" // string | The payment_link ID

	configuration := openapiclient.NewConfiguration()
	apiClient := openapiclient.NewAPIClient(configuration)
	r, err := apiClient.PaymentLinkAPI.PaymentLinksLinkIdDelete(context.Background(), linkId).Execute()
	if err != nil {
		fmt.Fprintf(os.Stderr, "Error when calling `PaymentLinkAPI.PaymentLinksLinkIdDelete``: %v\n", err)
		fmt.Fprintf(os.Stderr, "Full HTTP response: %v\n", r)
	}
}
```

### Path Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
**ctx** | **context.Context** | context for authentication, logging, cancellation, deadlines, tracing, etc.
**linkId** | **string** | The payment_link ID | 

### Other Parameters

Other parameters are passed through a pointer to a apiPaymentLinksLinkIdDeleteRequest struct via the builder pattern


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


## PaymentLinksLinkIdGet

> PaymentLinks PaymentLinksLinkIdGet(ctx, linkId).Execute()

Get payment_link



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
	linkId := "38400000-8cf0-11bd-b23e-10b96e4ef00d" // string | The payment_link ID

	configuration := openapiclient.NewConfiguration()
	apiClient := openapiclient.NewAPIClient(configuration)
	resp, r, err := apiClient.PaymentLinkAPI.PaymentLinksLinkIdGet(context.Background(), linkId).Execute()
	if err != nil {
		fmt.Fprintf(os.Stderr, "Error when calling `PaymentLinkAPI.PaymentLinksLinkIdGet``: %v\n", err)
		fmt.Fprintf(os.Stderr, "Full HTTP response: %v\n", r)
	}
	// response from `PaymentLinksLinkIdGet`: PaymentLinks
	fmt.Fprintf(os.Stdout, "Response from `PaymentLinkAPI.PaymentLinksLinkIdGet`: %v\n", resp)
}
```

### Path Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
**ctx** | **context.Context** | context for authentication, logging, cancellation, deadlines, tracing, etc.
**linkId** | **string** | The payment_link ID | 

### Other Parameters

Other parameters are passed through a pointer to a apiPaymentLinksLinkIdGetRequest struct via the builder pattern


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------


### Return type

[**PaymentLinks**](PaymentLinks.md)

### Authorization

[ApiKeyAuth](../README.md#ApiKeyAuth)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints)
[[Back to Model list]](../README.md#documentation-for-models)
[[Back to README]](../README.md)


## PaymentLinksLinkIdPatch

> PaymentLinks PaymentLinksLinkIdPatch(ctx, linkId).PaymentLinksUpdate(paymentLinksUpdate).Execute()

Update payment_link



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
	linkId := "38400000-8cf0-11bd-b23e-10b96e4ef00d" // string | The payment_link ID
	paymentLinksUpdate := *openapiclient.NewPaymentLinksUpdate() // PaymentLinksUpdate | 

	configuration := openapiclient.NewConfiguration()
	apiClient := openapiclient.NewAPIClient(configuration)
	resp, r, err := apiClient.PaymentLinkAPI.PaymentLinksLinkIdPatch(context.Background(), linkId).PaymentLinksUpdate(paymentLinksUpdate).Execute()
	if err != nil {
		fmt.Fprintf(os.Stderr, "Error when calling `PaymentLinkAPI.PaymentLinksLinkIdPatch``: %v\n", err)
		fmt.Fprintf(os.Stderr, "Full HTTP response: %v\n", r)
	}
	// response from `PaymentLinksLinkIdPatch`: PaymentLinks
	fmt.Fprintf(os.Stdout, "Response from `PaymentLinkAPI.PaymentLinksLinkIdPatch`: %v\n", resp)
}
```

### Path Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
**ctx** | **context.Context** | context for authentication, logging, cancellation, deadlines, tracing, etc.
**linkId** | **string** | The payment_link ID | 

### Other Parameters

Other parameters are passed through a pointer to a apiPaymentLinksLinkIdPatchRequest struct via the builder pattern


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------

 **paymentLinksUpdate** | [**PaymentLinksUpdate**](PaymentLinksUpdate.md) |  | 

### Return type

[**PaymentLinks**](PaymentLinks.md)

### Authorization

[ApiKeyAuth](../README.md#ApiKeyAuth)

### HTTP request headers

- **Content-Type**: application/json
- **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints)
[[Back to Model list]](../README.md#documentation-for-models)
[[Back to README]](../README.md)


## PaymentLinksPost

> PaymentLinks PaymentLinksPost(ctx).PaymentLinksCreate(paymentLinksCreate).Execute()

Create payment_link



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
	paymentLinksCreate := *openapiclient.NewPaymentLinksCreate() // PaymentLinksCreate | 

	configuration := openapiclient.NewConfiguration()
	apiClient := openapiclient.NewAPIClient(configuration)
	resp, r, err := apiClient.PaymentLinkAPI.PaymentLinksPost(context.Background()).PaymentLinksCreate(paymentLinksCreate).Execute()
	if err != nil {
		fmt.Fprintf(os.Stderr, "Error when calling `PaymentLinkAPI.PaymentLinksPost``: %v\n", err)
		fmt.Fprintf(os.Stderr, "Full HTTP response: %v\n", r)
	}
	// response from `PaymentLinksPost`: PaymentLinks
	fmt.Fprintf(os.Stdout, "Response from `PaymentLinkAPI.PaymentLinksPost`: %v\n", resp)
}
```

### Path Parameters



### Other Parameters

Other parameters are passed through a pointer to a apiPaymentLinksPostRequest struct via the builder pattern


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **paymentLinksCreate** | [**PaymentLinksCreate**](PaymentLinksCreate.md) |  | 

### Return type

[**PaymentLinks**](PaymentLinks.md)

### Authorization

[ApiKeyAuth](../README.md#ApiKeyAuth)

### HTTP request headers

- **Content-Type**: application/json
- **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints)
[[Back to Model list]](../README.md#documentation-for-models)
[[Back to README]](../README.md)

