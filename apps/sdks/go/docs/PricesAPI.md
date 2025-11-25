# \PricesAPI

All URIs are relative to *https://api.lomi.africa/v1*

Method | HTTP request | Description
------------- | ------------- | -------------
[**CreatePrice**](PricesAPI.md#CreatePrice) | **Post** /prices | Create price
[**DeletePrice**](PricesAPI.md#DeletePrice) | **Delete** /prices/{price_id} | Delete price
[**ListPrices**](PricesAPI.md#ListPrices) | **Get** /prices | List prices
[**RetrievePrice**](PricesAPI.md#RetrievePrice) | **Get** /prices/{price_id} | Retrieve price
[**UpdatePrice**](PricesAPI.md#UpdatePrice) | **Patch** /prices/{price_id} | Update price



## CreatePrice

> Prices CreatePrice(ctx).PricesCreate(pricesCreate).Execute()

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
	resp, r, err := apiClient.PricesAPI.CreatePrice(context.Background()).PricesCreate(pricesCreate).Execute()
	if err != nil {
		fmt.Fprintf(os.Stderr, "Error when calling `PricesAPI.CreatePrice``: %v\n", err)
		fmt.Fprintf(os.Stderr, "Full HTTP response: %v\n", r)
	}
	// response from `CreatePrice`: Prices
	fmt.Fprintf(os.Stdout, "Response from `PricesAPI.CreatePrice`: %v\n", resp)
}
```

### Path Parameters



### Other Parameters

Other parameters are passed through a pointer to a apiCreatePriceRequest struct via the builder pattern


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


## DeletePrice

> DeletePrice(ctx, priceId).Execute()

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
	priceId := "38400000-8cf0-11bd-b23e-10b96e4ef00d" // string | Unique identifier for the price

	configuration := openapiclient.NewConfiguration()
	apiClient := openapiclient.NewAPIClient(configuration)
	r, err := apiClient.PricesAPI.DeletePrice(context.Background(), priceId).Execute()
	if err != nil {
		fmt.Fprintf(os.Stderr, "Error when calling `PricesAPI.DeletePrice``: %v\n", err)
		fmt.Fprintf(os.Stderr, "Full HTTP response: %v\n", r)
	}
}
```

### Path Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
**ctx** | **context.Context** | context for authentication, logging, cancellation, deadlines, tracing, etc.
**priceId** | **string** | Unique identifier for the price | 

### Other Parameters

Other parameters are passed through a pointer to a apiDeletePriceRequest struct via the builder pattern


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


## ListPrices

> ListPrices200Response ListPrices(ctx).Limit(limit).Offset(offset).Sort(sort).Execute()

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
	limit := int32(56) // int32 | Maximum number of items to return (1-100) (optional) (default to 20)
	offset := int32(56) // int32 | Number of items to skip for pagination (optional) (default to 0)
	sort := "created_at:desc" // string | Sort order. Format: `field:direction` (e.g., `created_at:desc`) (optional)

	configuration := openapiclient.NewConfiguration()
	apiClient := openapiclient.NewAPIClient(configuration)
	resp, r, err := apiClient.PricesAPI.ListPrices(context.Background()).Limit(limit).Offset(offset).Sort(sort).Execute()
	if err != nil {
		fmt.Fprintf(os.Stderr, "Error when calling `PricesAPI.ListPrices``: %v\n", err)
		fmt.Fprintf(os.Stderr, "Full HTTP response: %v\n", r)
	}
	// response from `ListPrices`: ListPrices200Response
	fmt.Fprintf(os.Stdout, "Response from `PricesAPI.ListPrices`: %v\n", resp)
}
```

### Path Parameters



### Other Parameters

Other parameters are passed through a pointer to a apiListPricesRequest struct via the builder pattern


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **limit** | **int32** | Maximum number of items to return (1-100) | [default to 20]
 **offset** | **int32** | Number of items to skip for pagination | [default to 0]
 **sort** | **string** | Sort order. Format: &#x60;field:direction&#x60; (e.g., &#x60;created_at:desc&#x60;) | 

### Return type

[**ListPrices200Response**](ListPrices200Response.md)

### Authorization

[ApiKeyAuth](../README.md#ApiKeyAuth)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints)
[[Back to Model list]](../README.md#documentation-for-models)
[[Back to README]](../README.md)


## RetrievePrice

> Prices RetrievePrice(ctx, priceId).Execute()

Retrieve price



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
	priceId := "38400000-8cf0-11bd-b23e-10b96e4ef00d" // string | Unique identifier for the price

	configuration := openapiclient.NewConfiguration()
	apiClient := openapiclient.NewAPIClient(configuration)
	resp, r, err := apiClient.PricesAPI.RetrievePrice(context.Background(), priceId).Execute()
	if err != nil {
		fmt.Fprintf(os.Stderr, "Error when calling `PricesAPI.RetrievePrice``: %v\n", err)
		fmt.Fprintf(os.Stderr, "Full HTTP response: %v\n", r)
	}
	// response from `RetrievePrice`: Prices
	fmt.Fprintf(os.Stdout, "Response from `PricesAPI.RetrievePrice`: %v\n", resp)
}
```

### Path Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
**ctx** | **context.Context** | context for authentication, logging, cancellation, deadlines, tracing, etc.
**priceId** | **string** | Unique identifier for the price | 

### Other Parameters

Other parameters are passed through a pointer to a apiRetrievePriceRequest struct via the builder pattern


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


## UpdatePrice

> Prices UpdatePrice(ctx, priceId).PricesUpdate(pricesUpdate).Execute()

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
	priceId := "38400000-8cf0-11bd-b23e-10b96e4ef00d" // string | Unique identifier for the price
	pricesUpdate := *openapiclient.NewPricesUpdate() // PricesUpdate | 

	configuration := openapiclient.NewConfiguration()
	apiClient := openapiclient.NewAPIClient(configuration)
	resp, r, err := apiClient.PricesAPI.UpdatePrice(context.Background(), priceId).PricesUpdate(pricesUpdate).Execute()
	if err != nil {
		fmt.Fprintf(os.Stderr, "Error when calling `PricesAPI.UpdatePrice``: %v\n", err)
		fmt.Fprintf(os.Stderr, "Full HTTP response: %v\n", r)
	}
	// response from `UpdatePrice`: Prices
	fmt.Fprintf(os.Stdout, "Response from `PricesAPI.UpdatePrice`: %v\n", resp)
}
```

### Path Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
**ctx** | **context.Context** | context for authentication, logging, cancellation, deadlines, tracing, etc.
**priceId** | **string** | Unique identifier for the price | 

### Other Parameters

Other parameters are passed through a pointer to a apiUpdatePriceRequest struct via the builder pattern


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

