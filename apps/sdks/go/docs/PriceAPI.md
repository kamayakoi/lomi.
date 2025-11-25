# \PriceAPI

All URIs are relative to *https://api.lomi.africa/v1*

Method | HTTP request | Description
------------- | ------------- | -------------
[**PricesGet**](PriceAPI.md#PricesGet) | **Get** /prices | List prices
[**PricesPost**](PriceAPI.md#PricesPost) | **Post** /prices | Create price
[**PricesPriceIdDelete**](PriceAPI.md#PricesPriceIdDelete) | **Delete** /prices/{price_id} | Delete price
[**PricesPriceIdGet**](PriceAPI.md#PricesPriceIdGet) | **Get** /prices/{price_id} | Get price
[**PricesPriceIdPatch**](PriceAPI.md#PricesPriceIdPatch) | **Patch** /prices/{price_id} | Update price



## PricesGet

> PricesGet200Response PricesGet(ctx).Limit(limit).Offset(offset).Sort(sort).Execute()

List prices



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
	resp, r, err := apiClient.PriceAPI.PricesGet(context.Background()).Limit(limit).Offset(offset).Sort(sort).Execute()
	if err != nil {
		fmt.Fprintf(os.Stderr, "Error when calling `PriceAPI.PricesGet``: %v\n", err)
		fmt.Fprintf(os.Stderr, "Full HTTP response: %v\n", r)
	}
	// response from `PricesGet`: PricesGet200Response
	fmt.Fprintf(os.Stdout, "Response from `PriceAPI.PricesGet`: %v\n", resp)
}
```

### Path Parameters



### Other Parameters

Other parameters are passed through a pointer to a apiPricesGetRequest struct via the builder pattern


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **limit** | **int32** | Maximum number of items to return | [default to 20]
 **offset** | **int32** | Number of items to skip | [default to 0]
 **sort** | **string** | Sort order (e.g., created_at:desc) | 

### Return type

[**PricesGet200Response**](PricesGet200Response.md)

### Authorization

[ApiKeyAuth](../README.md#ApiKeyAuth)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints)
[[Back to Model list]](../README.md#documentation-for-models)
[[Back to README]](../README.md)


## PricesPost

> Prices PricesPost(ctx).PricesCreate(pricesCreate).Execute()

Create price



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
	pricesCreate := *openapiclient.NewPricesCreate() // PricesCreate | 

	configuration := openapiclient.NewConfiguration()
	apiClient := openapiclient.NewAPIClient(configuration)
	resp, r, err := apiClient.PriceAPI.PricesPost(context.Background()).PricesCreate(pricesCreate).Execute()
	if err != nil {
		fmt.Fprintf(os.Stderr, "Error when calling `PriceAPI.PricesPost``: %v\n", err)
		fmt.Fprintf(os.Stderr, "Full HTTP response: %v\n", r)
	}
	// response from `PricesPost`: Prices
	fmt.Fprintf(os.Stdout, "Response from `PriceAPI.PricesPost`: %v\n", resp)
}
```

### Path Parameters



### Other Parameters

Other parameters are passed through a pointer to a apiPricesPostRequest struct via the builder pattern


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **pricesCreate** | [**PricesCreate**](PricesCreate.md) |  | 

### Return type

[**Prices**](Prices.md)

### Authorization

[ApiKeyAuth](../README.md#ApiKeyAuth)

### HTTP request headers

- **Content-Type**: application/json
- **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints)
[[Back to Model list]](../README.md#documentation-for-models)
[[Back to README]](../README.md)


## PricesPriceIdDelete

> PricesPriceIdDelete(ctx, priceId).Execute()

Delete price



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
	priceId := "38400000-8cf0-11bd-b23e-10b96e4ef00d" // string | The price ID

	configuration := openapiclient.NewConfiguration()
	apiClient := openapiclient.NewAPIClient(configuration)
	r, err := apiClient.PriceAPI.PricesPriceIdDelete(context.Background(), priceId).Execute()
	if err != nil {
		fmt.Fprintf(os.Stderr, "Error when calling `PriceAPI.PricesPriceIdDelete``: %v\n", err)
		fmt.Fprintf(os.Stderr, "Full HTTP response: %v\n", r)
	}
}
```

### Path Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
**ctx** | **context.Context** | context for authentication, logging, cancellation, deadlines, tracing, etc.
**priceId** | **string** | The price ID | 

### Other Parameters

Other parameters are passed through a pointer to a apiPricesPriceIdDeleteRequest struct via the builder pattern


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


## PricesPriceIdGet

> Prices PricesPriceIdGet(ctx, priceId).Execute()

Get price



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
	priceId := "38400000-8cf0-11bd-b23e-10b96e4ef00d" // string | The price ID

	configuration := openapiclient.NewConfiguration()
	apiClient := openapiclient.NewAPIClient(configuration)
	resp, r, err := apiClient.PriceAPI.PricesPriceIdGet(context.Background(), priceId).Execute()
	if err != nil {
		fmt.Fprintf(os.Stderr, "Error when calling `PriceAPI.PricesPriceIdGet``: %v\n", err)
		fmt.Fprintf(os.Stderr, "Full HTTP response: %v\n", r)
	}
	// response from `PricesPriceIdGet`: Prices
	fmt.Fprintf(os.Stdout, "Response from `PriceAPI.PricesPriceIdGet`: %v\n", resp)
}
```

### Path Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
**ctx** | **context.Context** | context for authentication, logging, cancellation, deadlines, tracing, etc.
**priceId** | **string** | The price ID | 

### Other Parameters

Other parameters are passed through a pointer to a apiPricesPriceIdGetRequest struct via the builder pattern


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------


### Return type

[**Prices**](Prices.md)

### Authorization

[ApiKeyAuth](../README.md#ApiKeyAuth)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints)
[[Back to Model list]](../README.md#documentation-for-models)
[[Back to README]](../README.md)


## PricesPriceIdPatch

> Prices PricesPriceIdPatch(ctx, priceId).PricesUpdate(pricesUpdate).Execute()

Update price



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
	priceId := "38400000-8cf0-11bd-b23e-10b96e4ef00d" // string | The price ID
	pricesUpdate := *openapiclient.NewPricesUpdate() // PricesUpdate | 

	configuration := openapiclient.NewConfiguration()
	apiClient := openapiclient.NewAPIClient(configuration)
	resp, r, err := apiClient.PriceAPI.PricesPriceIdPatch(context.Background(), priceId).PricesUpdate(pricesUpdate).Execute()
	if err != nil {
		fmt.Fprintf(os.Stderr, "Error when calling `PriceAPI.PricesPriceIdPatch``: %v\n", err)
		fmt.Fprintf(os.Stderr, "Full HTTP response: %v\n", r)
	}
	// response from `PricesPriceIdPatch`: Prices
	fmt.Fprintf(os.Stdout, "Response from `PriceAPI.PricesPriceIdPatch`: %v\n", resp)
}
```

### Path Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
**ctx** | **context.Context** | context for authentication, logging, cancellation, deadlines, tracing, etc.
**priceId** | **string** | The price ID | 

### Other Parameters

Other parameters are passed through a pointer to a apiPricesPriceIdPatchRequest struct via the builder pattern


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------

 **pricesUpdate** | [**PricesUpdate**](PricesUpdate.md) |  | 

### Return type

[**Prices**](Prices.md)

### Authorization

[ApiKeyAuth](../README.md#ApiKeyAuth)

### HTTP request headers

- **Content-Type**: application/json
- **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints)
[[Back to Model list]](../README.md#documentation-for-models)
[[Back to README]](../README.md)

