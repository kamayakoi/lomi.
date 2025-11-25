# \PaymentLinksAPI

All URIs are relative to *https://api.lomi.africa/v1*

Method | HTTP request | Description
------------- | ------------- | -------------
[**CreatePaymentLink**](PaymentLinksAPI.md#CreatePaymentLink) | **Post** /payment_links | Create payment link
[**DeletePaymentLink**](PaymentLinksAPI.md#DeletePaymentLink) | **Delete** /payment_links/{link_id} | Delete payment link
[**ListPaymentLinks**](PaymentLinksAPI.md#ListPaymentLinks) | **Get** /payment_links | List payment links
[**RetrievePaymentLink**](PaymentLinksAPI.md#RetrievePaymentLink) | **Get** /payment_links/{link_id} | Retrieve payment link
[**UpdatePaymentLink**](PaymentLinksAPI.md#UpdatePaymentLink) | **Patch** /payment_links/{link_id} | Update payment link



## CreatePaymentLink

> PaymentLinks CreatePaymentLink(ctx).PaymentLinksCreate(paymentLinksCreate).Execute()

Create payment link



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
	resp, r, err := apiClient.PaymentLinksAPI.CreatePaymentLink(context.Background()).PaymentLinksCreate(paymentLinksCreate).Execute()
	if err != nil {
		fmt.Fprintf(os.Stderr, "Error when calling `PaymentLinksAPI.CreatePaymentLink``: %v\n", err)
		fmt.Fprintf(os.Stderr, "Full HTTP response: %v\n", r)
	}
	// response from `CreatePaymentLink`: PaymentLinks
	fmt.Fprintf(os.Stdout, "Response from `PaymentLinksAPI.CreatePaymentLink`: %v\n", resp)
}
```

### Path Parameters



### Other Parameters

Other parameters are passed through a pointer to a apiCreatePaymentLinkRequest struct via the builder pattern


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


## DeletePaymentLink

> DeletePaymentLink(ctx, linkId).Execute()

Delete payment link



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
	linkId := "38400000-8cf0-11bd-b23e-10b96e4ef00d" // string | Unique identifier for the payment link

	configuration := openapiclient.NewConfiguration()
	apiClient := openapiclient.NewAPIClient(configuration)
	r, err := apiClient.PaymentLinksAPI.DeletePaymentLink(context.Background(), linkId).Execute()
	if err != nil {
		fmt.Fprintf(os.Stderr, "Error when calling `PaymentLinksAPI.DeletePaymentLink``: %v\n", err)
		fmt.Fprintf(os.Stderr, "Full HTTP response: %v\n", r)
	}
}
```

### Path Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
**ctx** | **context.Context** | context for authentication, logging, cancellation, deadlines, tracing, etc.
**linkId** | **string** | Unique identifier for the payment link | 

### Other Parameters

Other parameters are passed through a pointer to a apiDeletePaymentLinkRequest struct via the builder pattern


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


## ListPaymentLinks

> ListPaymentLinks200Response ListPaymentLinks(ctx).Limit(limit).Offset(offset).Sort(sort).Execute()

List payment links



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
	resp, r, err := apiClient.PaymentLinksAPI.ListPaymentLinks(context.Background()).Limit(limit).Offset(offset).Sort(sort).Execute()
	if err != nil {
		fmt.Fprintf(os.Stderr, "Error when calling `PaymentLinksAPI.ListPaymentLinks``: %v\n", err)
		fmt.Fprintf(os.Stderr, "Full HTTP response: %v\n", r)
	}
	// response from `ListPaymentLinks`: ListPaymentLinks200Response
	fmt.Fprintf(os.Stdout, "Response from `PaymentLinksAPI.ListPaymentLinks`: %v\n", resp)
}
```

### Path Parameters



### Other Parameters

Other parameters are passed through a pointer to a apiListPaymentLinksRequest struct via the builder pattern


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **limit** | **int32** | Maximum number of items to return (1-100) | [default to 20]
 **offset** | **int32** | Number of items to skip for pagination | [default to 0]
 **sort** | **string** | Sort order. Format: &#x60;field:direction&#x60; (e.g., &#x60;created_at:desc&#x60;) | 

### Return type

[**ListPaymentLinks200Response**](ListPaymentLinks200Response.md)

### Authorization

[ApiKeyAuth](../README.md#ApiKeyAuth)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints)
[[Back to Model list]](../README.md#documentation-for-models)
[[Back to README]](../README.md)


## RetrievePaymentLink

> PaymentLinks RetrievePaymentLink(ctx, linkId).Execute()

Retrieve payment link



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
	linkId := "38400000-8cf0-11bd-b23e-10b96e4ef00d" // string | Unique identifier for the payment link

	configuration := openapiclient.NewConfiguration()
	apiClient := openapiclient.NewAPIClient(configuration)
	resp, r, err := apiClient.PaymentLinksAPI.RetrievePaymentLink(context.Background(), linkId).Execute()
	if err != nil {
		fmt.Fprintf(os.Stderr, "Error when calling `PaymentLinksAPI.RetrievePaymentLink``: %v\n", err)
		fmt.Fprintf(os.Stderr, "Full HTTP response: %v\n", r)
	}
	// response from `RetrievePaymentLink`: PaymentLinks
	fmt.Fprintf(os.Stdout, "Response from `PaymentLinksAPI.RetrievePaymentLink`: %v\n", resp)
}
```

### Path Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
**ctx** | **context.Context** | context for authentication, logging, cancellation, deadlines, tracing, etc.
**linkId** | **string** | Unique identifier for the payment link | 

### Other Parameters

Other parameters are passed through a pointer to a apiRetrievePaymentLinkRequest struct via the builder pattern


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


## UpdatePaymentLink

> PaymentLinks UpdatePaymentLink(ctx, linkId).PaymentLinksUpdate(paymentLinksUpdate).Execute()

Update payment link



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
	linkId := "38400000-8cf0-11bd-b23e-10b96e4ef00d" // string | Unique identifier for the payment link
	paymentLinksUpdate := *openapiclient.NewPaymentLinksUpdate() // PaymentLinksUpdate | 

	configuration := openapiclient.NewConfiguration()
	apiClient := openapiclient.NewAPIClient(configuration)
	resp, r, err := apiClient.PaymentLinksAPI.UpdatePaymentLink(context.Background(), linkId).PaymentLinksUpdate(paymentLinksUpdate).Execute()
	if err != nil {
		fmt.Fprintf(os.Stderr, "Error when calling `PaymentLinksAPI.UpdatePaymentLink``: %v\n", err)
		fmt.Fprintf(os.Stderr, "Full HTTP response: %v\n", r)
	}
	// response from `UpdatePaymentLink`: PaymentLinks
	fmt.Fprintf(os.Stdout, "Response from `PaymentLinksAPI.UpdatePaymentLink`: %v\n", resp)
}
```

### Path Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
**ctx** | **context.Context** | context for authentication, logging, cancellation, deadlines, tracing, etc.
**linkId** | **string** | Unique identifier for the payment link | 

### Other Parameters

Other parameters are passed through a pointer to a apiUpdatePaymentLinkRequest struct via the builder pattern


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

