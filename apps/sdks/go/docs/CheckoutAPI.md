# \CheckoutAPI

All URIs are relative to *https://api.lomi.africa/v1*

Method | HTTP request | Description
------------- | ------------- | -------------
[**CreateCheckoutSession**](CheckoutAPI.md#CreateCheckoutSession) | **Post** /checkout_sessions | Create checkout session
[**CreatePaymentLink**](CheckoutAPI.md#CreatePaymentLink) | **Post** /payment_links | Create payment link
[**DeleteCheckoutSession**](CheckoutAPI.md#DeleteCheckoutSession) | **Delete** /checkout_sessions/{session_id} | Delete checkout session
[**DeletePaymentLink**](CheckoutAPI.md#DeletePaymentLink) | **Delete** /payment_links/{link_id} | Delete payment link
[**ListCheckoutSessions**](CheckoutAPI.md#ListCheckoutSessions) | **Get** /checkout_sessions | List checkout sessions
[**ListPaymentLinks**](CheckoutAPI.md#ListPaymentLinks) | **Get** /payment_links | List payment links
[**RetrieveCheckoutSession**](CheckoutAPI.md#RetrieveCheckoutSession) | **Get** /checkout_sessions/{session_id} | Retrieve checkout session
[**RetrievePaymentLink**](CheckoutAPI.md#RetrievePaymentLink) | **Get** /payment_links/{link_id} | Retrieve payment link
[**UpdateCheckoutSession**](CheckoutAPI.md#UpdateCheckoutSession) | **Patch** /checkout_sessions/{session_id} | Update checkout session
[**UpdatePaymentLink**](CheckoutAPI.md#UpdatePaymentLink) | **Patch** /payment_links/{link_id} | Update payment link



## CreateCheckoutSession

> CheckoutSessions CreateCheckoutSession(ctx).CheckoutSessionsCreate(checkoutSessionsCreate).Execute()

Create checkout session



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
	checkoutSessionsCreate := *openapiclient.NewCheckoutSessionsCreate() // CheckoutSessionsCreate | 

	configuration := openapiclient.NewConfiguration()
	apiClient := openapiclient.NewAPIClient(configuration)
	resp, r, err := apiClient.CheckoutAPI.CreateCheckoutSession(context.Background()).CheckoutSessionsCreate(checkoutSessionsCreate).Execute()
	if err != nil {
		fmt.Fprintf(os.Stderr, "Error when calling `CheckoutAPI.CreateCheckoutSession``: %v\n", err)
		fmt.Fprintf(os.Stderr, "Full HTTP response: %v\n", r)
	}
	// response from `CreateCheckoutSession`: CheckoutSessions
	fmt.Fprintf(os.Stdout, "Response from `CheckoutAPI.CreateCheckoutSession`: %v\n", resp)
}
```

### Path Parameters



### Other Parameters

Other parameters are passed through a pointer to a apiCreateCheckoutSessionRequest struct via the builder pattern


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **checkoutSessionsCreate** | [**CheckoutSessionsCreate**](CheckoutSessionsCreate.md) |  | 

### Return type

[**CheckoutSessions**](CheckoutSessions.md)

### Authorization

[ApiKeyAuth](../README.md#ApiKeyAuth)

### HTTP request headers

- **Content-Type**: application/json
- **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints)
[[Back to Model list]](../README.md#documentation-for-models)
[[Back to README]](../README.md)


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
	resp, r, err := apiClient.CheckoutAPI.CreatePaymentLink(context.Background()).PaymentLinksCreate(paymentLinksCreate).Execute()
	if err != nil {
		fmt.Fprintf(os.Stderr, "Error when calling `CheckoutAPI.CreatePaymentLink``: %v\n", err)
		fmt.Fprintf(os.Stderr, "Full HTTP response: %v\n", r)
	}
	// response from `CreatePaymentLink`: PaymentLinks
	fmt.Fprintf(os.Stdout, "Response from `CheckoutAPI.CreatePaymentLink`: %v\n", resp)
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


## DeleteCheckoutSession

> DeleteCheckoutSession(ctx, sessionId).Execute()

Delete checkout session



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
	sessionId := "38400000-8cf0-11bd-b23e-10b96e4ef00d" // string | Unique identifier for the checkout session

	configuration := openapiclient.NewConfiguration()
	apiClient := openapiclient.NewAPIClient(configuration)
	r, err := apiClient.CheckoutAPI.DeleteCheckoutSession(context.Background(), sessionId).Execute()
	if err != nil {
		fmt.Fprintf(os.Stderr, "Error when calling `CheckoutAPI.DeleteCheckoutSession``: %v\n", err)
		fmt.Fprintf(os.Stderr, "Full HTTP response: %v\n", r)
	}
}
```

### Path Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
**ctx** | **context.Context** | context for authentication, logging, cancellation, deadlines, tracing, etc.
**sessionId** | **string** | Unique identifier for the checkout session | 

### Other Parameters

Other parameters are passed through a pointer to a apiDeleteCheckoutSessionRequest struct via the builder pattern


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
	r, err := apiClient.CheckoutAPI.DeletePaymentLink(context.Background(), linkId).Execute()
	if err != nil {
		fmt.Fprintf(os.Stderr, "Error when calling `CheckoutAPI.DeletePaymentLink``: %v\n", err)
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


## ListCheckoutSessions

> ListCheckoutSessions200Response ListCheckoutSessions(ctx).Limit(limit).Offset(offset).Sort(sort).Execute()

List checkout sessions



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
	resp, r, err := apiClient.CheckoutAPI.ListCheckoutSessions(context.Background()).Limit(limit).Offset(offset).Sort(sort).Execute()
	if err != nil {
		fmt.Fprintf(os.Stderr, "Error when calling `CheckoutAPI.ListCheckoutSessions``: %v\n", err)
		fmt.Fprintf(os.Stderr, "Full HTTP response: %v\n", r)
	}
	// response from `ListCheckoutSessions`: ListCheckoutSessions200Response
	fmt.Fprintf(os.Stdout, "Response from `CheckoutAPI.ListCheckoutSessions`: %v\n", resp)
}
```

### Path Parameters



### Other Parameters

Other parameters are passed through a pointer to a apiListCheckoutSessionsRequest struct via the builder pattern


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **limit** | **int32** | Maximum number of items to return (1-100) | [default to 20]
 **offset** | **int32** | Number of items to skip for pagination | [default to 0]
 **sort** | **string** | Sort order. Format: &#x60;field:direction&#x60; (e.g., &#x60;created_at:desc&#x60;) | 

### Return type

[**ListCheckoutSessions200Response**](ListCheckoutSessions200Response.md)

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
	resp, r, err := apiClient.CheckoutAPI.ListPaymentLinks(context.Background()).Limit(limit).Offset(offset).Sort(sort).Execute()
	if err != nil {
		fmt.Fprintf(os.Stderr, "Error when calling `CheckoutAPI.ListPaymentLinks``: %v\n", err)
		fmt.Fprintf(os.Stderr, "Full HTTP response: %v\n", r)
	}
	// response from `ListPaymentLinks`: ListPaymentLinks200Response
	fmt.Fprintf(os.Stdout, "Response from `CheckoutAPI.ListPaymentLinks`: %v\n", resp)
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


## RetrieveCheckoutSession

> CheckoutSessions RetrieveCheckoutSession(ctx, sessionId).Execute()

Retrieve checkout session



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
	sessionId := "38400000-8cf0-11bd-b23e-10b96e4ef00d" // string | Unique identifier for the checkout session

	configuration := openapiclient.NewConfiguration()
	apiClient := openapiclient.NewAPIClient(configuration)
	resp, r, err := apiClient.CheckoutAPI.RetrieveCheckoutSession(context.Background(), sessionId).Execute()
	if err != nil {
		fmt.Fprintf(os.Stderr, "Error when calling `CheckoutAPI.RetrieveCheckoutSession``: %v\n", err)
		fmt.Fprintf(os.Stderr, "Full HTTP response: %v\n", r)
	}
	// response from `RetrieveCheckoutSession`: CheckoutSessions
	fmt.Fprintf(os.Stdout, "Response from `CheckoutAPI.RetrieveCheckoutSession`: %v\n", resp)
}
```

### Path Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
**ctx** | **context.Context** | context for authentication, logging, cancellation, deadlines, tracing, etc.
**sessionId** | **string** | Unique identifier for the checkout session | 

### Other Parameters

Other parameters are passed through a pointer to a apiRetrieveCheckoutSessionRequest struct via the builder pattern


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------


### Return type

[**CheckoutSessions**](CheckoutSessions.md)

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
	resp, r, err := apiClient.CheckoutAPI.RetrievePaymentLink(context.Background(), linkId).Execute()
	if err != nil {
		fmt.Fprintf(os.Stderr, "Error when calling `CheckoutAPI.RetrievePaymentLink``: %v\n", err)
		fmt.Fprintf(os.Stderr, "Full HTTP response: %v\n", r)
	}
	// response from `RetrievePaymentLink`: PaymentLinks
	fmt.Fprintf(os.Stdout, "Response from `CheckoutAPI.RetrievePaymentLink`: %v\n", resp)
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


## UpdateCheckoutSession

> CheckoutSessions UpdateCheckoutSession(ctx, sessionId).CheckoutSessionsUpdate(checkoutSessionsUpdate).Execute()

Update checkout session



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
	sessionId := "38400000-8cf0-11bd-b23e-10b96e4ef00d" // string | Unique identifier for the checkout session
	checkoutSessionsUpdate := *openapiclient.NewCheckoutSessionsUpdate() // CheckoutSessionsUpdate | 

	configuration := openapiclient.NewConfiguration()
	apiClient := openapiclient.NewAPIClient(configuration)
	resp, r, err := apiClient.CheckoutAPI.UpdateCheckoutSession(context.Background(), sessionId).CheckoutSessionsUpdate(checkoutSessionsUpdate).Execute()
	if err != nil {
		fmt.Fprintf(os.Stderr, "Error when calling `CheckoutAPI.UpdateCheckoutSession``: %v\n", err)
		fmt.Fprintf(os.Stderr, "Full HTTP response: %v\n", r)
	}
	// response from `UpdateCheckoutSession`: CheckoutSessions
	fmt.Fprintf(os.Stdout, "Response from `CheckoutAPI.UpdateCheckoutSession`: %v\n", resp)
}
```

### Path Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
**ctx** | **context.Context** | context for authentication, logging, cancellation, deadlines, tracing, etc.
**sessionId** | **string** | Unique identifier for the checkout session | 

### Other Parameters

Other parameters are passed through a pointer to a apiUpdateCheckoutSessionRequest struct via the builder pattern


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------

 **checkoutSessionsUpdate** | [**CheckoutSessionsUpdate**](CheckoutSessionsUpdate.md) |  | 

### Return type

[**CheckoutSessions**](CheckoutSessions.md)

### Authorization

[ApiKeyAuth](../README.md#ApiKeyAuth)

### HTTP request headers

- **Content-Type**: application/json
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
	resp, r, err := apiClient.CheckoutAPI.UpdatePaymentLink(context.Background(), linkId).PaymentLinksUpdate(paymentLinksUpdate).Execute()
	if err != nil {
		fmt.Fprintf(os.Stderr, "Error when calling `CheckoutAPI.UpdatePaymentLink``: %v\n", err)
		fmt.Fprintf(os.Stderr, "Full HTTP response: %v\n", r)
	}
	// response from `UpdatePaymentLink`: PaymentLinks
	fmt.Fprintf(os.Stdout, "Response from `CheckoutAPI.UpdatePaymentLink`: %v\n", resp)
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

