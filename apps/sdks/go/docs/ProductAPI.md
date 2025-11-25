# \ProductAPI

All URIs are relative to *https://api.lomi.africa/v1*

Method | HTTP request | Description
------------- | ------------- | -------------
[**ProductsGet**](ProductAPI.md#ProductsGet) | **Get** /products | List products
[**ProductsPost**](ProductAPI.md#ProductsPost) | **Post** /products | Create product
[**ProductsProductIdDelete**](ProductAPI.md#ProductsProductIdDelete) | **Delete** /products/{product_id} | Delete product
[**ProductsProductIdGet**](ProductAPI.md#ProductsProductIdGet) | **Get** /products/{product_id} | Get product
[**ProductsProductIdPatch**](ProductAPI.md#ProductsProductIdPatch) | **Patch** /products/{product_id} | Update product



## ProductsGet

> ProductsGet200Response ProductsGet(ctx).Limit(limit).Offset(offset).Sort(sort).Execute()

List products



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
	resp, r, err := apiClient.ProductAPI.ProductsGet(context.Background()).Limit(limit).Offset(offset).Sort(sort).Execute()
	if err != nil {
		fmt.Fprintf(os.Stderr, "Error when calling `ProductAPI.ProductsGet``: %v\n", err)
		fmt.Fprintf(os.Stderr, "Full HTTP response: %v\n", r)
	}
	// response from `ProductsGet`: ProductsGet200Response
	fmt.Fprintf(os.Stdout, "Response from `ProductAPI.ProductsGet`: %v\n", resp)
}
```

### Path Parameters



### Other Parameters

Other parameters are passed through a pointer to a apiProductsGetRequest struct via the builder pattern


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **limit** | **int32** | Maximum number of items to return | [default to 20]
 **offset** | **int32** | Number of items to skip | [default to 0]
 **sort** | **string** | Sort order (e.g., created_at:desc) | 

### Return type

[**ProductsGet200Response**](ProductsGet200Response.md)

### Authorization

[ApiKeyAuth](../README.md#ApiKeyAuth)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints)
[[Back to Model list]](../README.md#documentation-for-models)
[[Back to README]](../README.md)


## ProductsPost

> Products ProductsPost(ctx).ProductsCreate(productsCreate).Execute()

Create product



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
	productsCreate := *openapiclient.NewProductsCreate() // ProductsCreate | 

	configuration := openapiclient.NewConfiguration()
	apiClient := openapiclient.NewAPIClient(configuration)
	resp, r, err := apiClient.ProductAPI.ProductsPost(context.Background()).ProductsCreate(productsCreate).Execute()
	if err != nil {
		fmt.Fprintf(os.Stderr, "Error when calling `ProductAPI.ProductsPost``: %v\n", err)
		fmt.Fprintf(os.Stderr, "Full HTTP response: %v\n", r)
	}
	// response from `ProductsPost`: Products
	fmt.Fprintf(os.Stdout, "Response from `ProductAPI.ProductsPost`: %v\n", resp)
}
```

### Path Parameters



### Other Parameters

Other parameters are passed through a pointer to a apiProductsPostRequest struct via the builder pattern


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **productsCreate** | [**ProductsCreate**](ProductsCreate.md) |  | 

### Return type

[**Products**](Products.md)

### Authorization

[ApiKeyAuth](../README.md#ApiKeyAuth)

### HTTP request headers

- **Content-Type**: application/json
- **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints)
[[Back to Model list]](../README.md#documentation-for-models)
[[Back to README]](../README.md)


## ProductsProductIdDelete

> ProductsProductIdDelete(ctx, productId).Execute()

Delete product



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
	productId := "38400000-8cf0-11bd-b23e-10b96e4ef00d" // string | The product ID

	configuration := openapiclient.NewConfiguration()
	apiClient := openapiclient.NewAPIClient(configuration)
	r, err := apiClient.ProductAPI.ProductsProductIdDelete(context.Background(), productId).Execute()
	if err != nil {
		fmt.Fprintf(os.Stderr, "Error when calling `ProductAPI.ProductsProductIdDelete``: %v\n", err)
		fmt.Fprintf(os.Stderr, "Full HTTP response: %v\n", r)
	}
}
```

### Path Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
**ctx** | **context.Context** | context for authentication, logging, cancellation, deadlines, tracing, etc.
**productId** | **string** | The product ID | 

### Other Parameters

Other parameters are passed through a pointer to a apiProductsProductIdDeleteRequest struct via the builder pattern


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


## ProductsProductIdGet

> Products ProductsProductIdGet(ctx, productId).Execute()

Get product



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
	productId := "38400000-8cf0-11bd-b23e-10b96e4ef00d" // string | The product ID

	configuration := openapiclient.NewConfiguration()
	apiClient := openapiclient.NewAPIClient(configuration)
	resp, r, err := apiClient.ProductAPI.ProductsProductIdGet(context.Background(), productId).Execute()
	if err != nil {
		fmt.Fprintf(os.Stderr, "Error when calling `ProductAPI.ProductsProductIdGet``: %v\n", err)
		fmt.Fprintf(os.Stderr, "Full HTTP response: %v\n", r)
	}
	// response from `ProductsProductIdGet`: Products
	fmt.Fprintf(os.Stdout, "Response from `ProductAPI.ProductsProductIdGet`: %v\n", resp)
}
```

### Path Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
**ctx** | **context.Context** | context for authentication, logging, cancellation, deadlines, tracing, etc.
**productId** | **string** | The product ID | 

### Other Parameters

Other parameters are passed through a pointer to a apiProductsProductIdGetRequest struct via the builder pattern


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------


### Return type

[**Products**](Products.md)

### Authorization

[ApiKeyAuth](../README.md#ApiKeyAuth)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints)
[[Back to Model list]](../README.md#documentation-for-models)
[[Back to README]](../README.md)


## ProductsProductIdPatch

> Products ProductsProductIdPatch(ctx, productId).ProductsUpdate(productsUpdate).Execute()

Update product



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
	productId := "38400000-8cf0-11bd-b23e-10b96e4ef00d" // string | The product ID
	productsUpdate := *openapiclient.NewProductsUpdate() // ProductsUpdate | 

	configuration := openapiclient.NewConfiguration()
	apiClient := openapiclient.NewAPIClient(configuration)
	resp, r, err := apiClient.ProductAPI.ProductsProductIdPatch(context.Background(), productId).ProductsUpdate(productsUpdate).Execute()
	if err != nil {
		fmt.Fprintf(os.Stderr, "Error when calling `ProductAPI.ProductsProductIdPatch``: %v\n", err)
		fmt.Fprintf(os.Stderr, "Full HTTP response: %v\n", r)
	}
	// response from `ProductsProductIdPatch`: Products
	fmt.Fprintf(os.Stdout, "Response from `ProductAPI.ProductsProductIdPatch`: %v\n", resp)
}
```

### Path Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
**ctx** | **context.Context** | context for authentication, logging, cancellation, deadlines, tracing, etc.
**productId** | **string** | The product ID | 

### Other Parameters

Other parameters are passed through a pointer to a apiProductsProductIdPatchRequest struct via the builder pattern


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------

 **productsUpdate** | [**ProductsUpdate**](ProductsUpdate.md) |  | 

### Return type

[**Products**](Products.md)

### Authorization

[ApiKeyAuth](../README.md#ApiKeyAuth)

### HTTP request headers

- **Content-Type**: application/json
- **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints)
[[Back to Model list]](../README.md#documentation-for-models)
[[Back to README]](../README.md)

