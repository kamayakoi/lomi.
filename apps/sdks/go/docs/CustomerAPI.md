# \CustomerAPI

All URIs are relative to *https://api.lomi.africa/v1*

Method | HTTP request | Description
------------- | ------------- | -------------
[**CustomersCustomerIdDelete**](CustomerAPI.md#CustomersCustomerIdDelete) | **Delete** /customers/{customer_id} | Delete customer
[**CustomersCustomerIdGet**](CustomerAPI.md#CustomersCustomerIdGet) | **Get** /customers/{customer_id} | Get customer
[**CustomersCustomerIdPatch**](CustomerAPI.md#CustomersCustomerIdPatch) | **Patch** /customers/{customer_id} | Update customer
[**CustomersGet**](CustomerAPI.md#CustomersGet) | **Get** /customers | List customers
[**CustomersPost**](CustomerAPI.md#CustomersPost) | **Post** /customers | Create customer



## CustomersCustomerIdDelete

> CustomersCustomerIdDelete(ctx, customerId).Execute()

Delete customer



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
	customerId := "38400000-8cf0-11bd-b23e-10b96e4ef00d" // string | The customer ID

	configuration := openapiclient.NewConfiguration()
	apiClient := openapiclient.NewAPIClient(configuration)
	r, err := apiClient.CustomerAPI.CustomersCustomerIdDelete(context.Background(), customerId).Execute()
	if err != nil {
		fmt.Fprintf(os.Stderr, "Error when calling `CustomerAPI.CustomersCustomerIdDelete``: %v\n", err)
		fmt.Fprintf(os.Stderr, "Full HTTP response: %v\n", r)
	}
}
```

### Path Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
**ctx** | **context.Context** | context for authentication, logging, cancellation, deadlines, tracing, etc.
**customerId** | **string** | The customer ID | 

### Other Parameters

Other parameters are passed through a pointer to a apiCustomersCustomerIdDeleteRequest struct via the builder pattern


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


## CustomersCustomerIdGet

> Customers CustomersCustomerIdGet(ctx, customerId).Execute()

Get customer



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
	customerId := "38400000-8cf0-11bd-b23e-10b96e4ef00d" // string | The customer ID

	configuration := openapiclient.NewConfiguration()
	apiClient := openapiclient.NewAPIClient(configuration)
	resp, r, err := apiClient.CustomerAPI.CustomersCustomerIdGet(context.Background(), customerId).Execute()
	if err != nil {
		fmt.Fprintf(os.Stderr, "Error when calling `CustomerAPI.CustomersCustomerIdGet``: %v\n", err)
		fmt.Fprintf(os.Stderr, "Full HTTP response: %v\n", r)
	}
	// response from `CustomersCustomerIdGet`: Customers
	fmt.Fprintf(os.Stdout, "Response from `CustomerAPI.CustomersCustomerIdGet`: %v\n", resp)
}
```

### Path Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
**ctx** | **context.Context** | context for authentication, logging, cancellation, deadlines, tracing, etc.
**customerId** | **string** | The customer ID | 

### Other Parameters

Other parameters are passed through a pointer to a apiCustomersCustomerIdGetRequest struct via the builder pattern


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------


### Return type

[**Customers**](Customers.md)

### Authorization

[ApiKeyAuth](../README.md#ApiKeyAuth)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints)
[[Back to Model list]](../README.md#documentation-for-models)
[[Back to README]](../README.md)


## CustomersCustomerIdPatch

> Customers CustomersCustomerIdPatch(ctx, customerId).CustomersUpdate(customersUpdate).Execute()

Update customer



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
	customerId := "38400000-8cf0-11bd-b23e-10b96e4ef00d" // string | The customer ID
	customersUpdate := *openapiclient.NewCustomersUpdate() // CustomersUpdate | 

	configuration := openapiclient.NewConfiguration()
	apiClient := openapiclient.NewAPIClient(configuration)
	resp, r, err := apiClient.CustomerAPI.CustomersCustomerIdPatch(context.Background(), customerId).CustomersUpdate(customersUpdate).Execute()
	if err != nil {
		fmt.Fprintf(os.Stderr, "Error when calling `CustomerAPI.CustomersCustomerIdPatch``: %v\n", err)
		fmt.Fprintf(os.Stderr, "Full HTTP response: %v\n", r)
	}
	// response from `CustomersCustomerIdPatch`: Customers
	fmt.Fprintf(os.Stdout, "Response from `CustomerAPI.CustomersCustomerIdPatch`: %v\n", resp)
}
```

### Path Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
**ctx** | **context.Context** | context for authentication, logging, cancellation, deadlines, tracing, etc.
**customerId** | **string** | The customer ID | 

### Other Parameters

Other parameters are passed through a pointer to a apiCustomersCustomerIdPatchRequest struct via the builder pattern


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------

 **customersUpdate** | [**CustomersUpdate**](CustomersUpdate.md) |  | 

### Return type

[**Customers**](Customers.md)

### Authorization

[ApiKeyAuth](../README.md#ApiKeyAuth)

### HTTP request headers

- **Content-Type**: application/json
- **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints)
[[Back to Model list]](../README.md#documentation-for-models)
[[Back to README]](../README.md)


## CustomersGet

> CustomersGet200Response CustomersGet(ctx).Limit(limit).Offset(offset).Sort(sort).Execute()

List customers



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
	resp, r, err := apiClient.CustomerAPI.CustomersGet(context.Background()).Limit(limit).Offset(offset).Sort(sort).Execute()
	if err != nil {
		fmt.Fprintf(os.Stderr, "Error when calling `CustomerAPI.CustomersGet``: %v\n", err)
		fmt.Fprintf(os.Stderr, "Full HTTP response: %v\n", r)
	}
	// response from `CustomersGet`: CustomersGet200Response
	fmt.Fprintf(os.Stdout, "Response from `CustomerAPI.CustomersGet`: %v\n", resp)
}
```

### Path Parameters



### Other Parameters

Other parameters are passed through a pointer to a apiCustomersGetRequest struct via the builder pattern


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **limit** | **int32** | Maximum number of items to return | [default to 20]
 **offset** | **int32** | Number of items to skip | [default to 0]
 **sort** | **string** | Sort order (e.g., created_at:desc) | 

### Return type

[**CustomersGet200Response**](CustomersGet200Response.md)

### Authorization

[ApiKeyAuth](../README.md#ApiKeyAuth)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints)
[[Back to Model list]](../README.md#documentation-for-models)
[[Back to README]](../README.md)


## CustomersPost

> Customers CustomersPost(ctx).CustomersCreate(customersCreate).Execute()

Create customer



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
	customersCreate := *openapiclient.NewCustomersCreate() // CustomersCreate | 

	configuration := openapiclient.NewConfiguration()
	apiClient := openapiclient.NewAPIClient(configuration)
	resp, r, err := apiClient.CustomerAPI.CustomersPost(context.Background()).CustomersCreate(customersCreate).Execute()
	if err != nil {
		fmt.Fprintf(os.Stderr, "Error when calling `CustomerAPI.CustomersPost``: %v\n", err)
		fmt.Fprintf(os.Stderr, "Full HTTP response: %v\n", r)
	}
	// response from `CustomersPost`: Customers
	fmt.Fprintf(os.Stdout, "Response from `CustomerAPI.CustomersPost`: %v\n", resp)
}
```

### Path Parameters



### Other Parameters

Other parameters are passed through a pointer to a apiCustomersPostRequest struct via the builder pattern


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **customersCreate** | [**CustomersCreate**](CustomersCreate.md) |  | 

### Return type

[**Customers**](Customers.md)

### Authorization

[ApiKeyAuth](../README.md#ApiKeyAuth)

### HTTP request headers

- **Content-Type**: application/json
- **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints)
[[Back to Model list]](../README.md#documentation-for-models)
[[Back to README]](../README.md)

