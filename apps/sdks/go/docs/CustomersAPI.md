# \CustomersAPI

All URIs are relative to *https://api.lomi.africa/v1*

Method | HTTP request | Description
------------- | ------------- | -------------
[**CreateCustomer**](CustomersAPI.md#CreateCustomer) | **Post** /customers | Create customer
[**DeleteCustomer**](CustomersAPI.md#DeleteCustomer) | **Delete** /customers/{customer_id} | Delete customer
[**ListCustomers**](CustomersAPI.md#ListCustomers) | **Get** /customers | List customers
[**RetrieveCustomer**](CustomersAPI.md#RetrieveCustomer) | **Get** /customers/{customer_id} | Retrieve customer
[**UpdateCustomer**](CustomersAPI.md#UpdateCustomer) | **Patch** /customers/{customer_id} | Update customer



## CreateCustomer

> Customers CreateCustomer(ctx).CustomersCreate(customersCreate).Execute()

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
	resp, r, err := apiClient.CustomersAPI.CreateCustomer(context.Background()).CustomersCreate(customersCreate).Execute()
	if err != nil {
		fmt.Fprintf(os.Stderr, "Error when calling `CustomersAPI.CreateCustomer``: %v\n", err)
		fmt.Fprintf(os.Stderr, "Full HTTP response: %v\n", r)
	}
	// response from `CreateCustomer`: Customers
	fmt.Fprintf(os.Stdout, "Response from `CustomersAPI.CreateCustomer`: %v\n", resp)
}
```

### Path Parameters



### Other Parameters

Other parameters are passed through a pointer to a apiCreateCustomerRequest struct via the builder pattern


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


## DeleteCustomer

> DeleteCustomer(ctx, customerId).Execute()

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
	customerId := "38400000-8cf0-11bd-b23e-10b96e4ef00d" // string | Unique identifier for the customer

	configuration := openapiclient.NewConfiguration()
	apiClient := openapiclient.NewAPIClient(configuration)
	r, err := apiClient.CustomersAPI.DeleteCustomer(context.Background(), customerId).Execute()
	if err != nil {
		fmt.Fprintf(os.Stderr, "Error when calling `CustomersAPI.DeleteCustomer``: %v\n", err)
		fmt.Fprintf(os.Stderr, "Full HTTP response: %v\n", r)
	}
}
```

### Path Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
**ctx** | **context.Context** | context for authentication, logging, cancellation, deadlines, tracing, etc.
**customerId** | **string** | Unique identifier for the customer | 

### Other Parameters

Other parameters are passed through a pointer to a apiDeleteCustomerRequest struct via the builder pattern


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


## ListCustomers

> ListCustomers200Response ListCustomers(ctx).Limit(limit).Offset(offset).Sort(sort).Execute()

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
	limit := int32(56) // int32 | Maximum number of items to return (1-100) (optional) (default to 20)
	offset := int32(56) // int32 | Number of items to skip for pagination (optional) (default to 0)
	sort := "created_at:desc" // string | Sort order. Format: `field:direction` (e.g., `created_at:desc`) (optional)

	configuration := openapiclient.NewConfiguration()
	apiClient := openapiclient.NewAPIClient(configuration)
	resp, r, err := apiClient.CustomersAPI.ListCustomers(context.Background()).Limit(limit).Offset(offset).Sort(sort).Execute()
	if err != nil {
		fmt.Fprintf(os.Stderr, "Error when calling `CustomersAPI.ListCustomers``: %v\n", err)
		fmt.Fprintf(os.Stderr, "Full HTTP response: %v\n", r)
	}
	// response from `ListCustomers`: ListCustomers200Response
	fmt.Fprintf(os.Stdout, "Response from `CustomersAPI.ListCustomers`: %v\n", resp)
}
```

### Path Parameters



### Other Parameters

Other parameters are passed through a pointer to a apiListCustomersRequest struct via the builder pattern


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **limit** | **int32** | Maximum number of items to return (1-100) | [default to 20]
 **offset** | **int32** | Number of items to skip for pagination | [default to 0]
 **sort** | **string** | Sort order. Format: &#x60;field:direction&#x60; (e.g., &#x60;created_at:desc&#x60;) | 

### Return type

[**ListCustomers200Response**](ListCustomers200Response.md)

### Authorization

[ApiKeyAuth](../README.md#ApiKeyAuth)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints)
[[Back to Model list]](../README.md#documentation-for-models)
[[Back to README]](../README.md)


## RetrieveCustomer

> Customers RetrieveCustomer(ctx, customerId).Execute()

Retrieve customer



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
	customerId := "38400000-8cf0-11bd-b23e-10b96e4ef00d" // string | Unique identifier for the customer

	configuration := openapiclient.NewConfiguration()
	apiClient := openapiclient.NewAPIClient(configuration)
	resp, r, err := apiClient.CustomersAPI.RetrieveCustomer(context.Background(), customerId).Execute()
	if err != nil {
		fmt.Fprintf(os.Stderr, "Error when calling `CustomersAPI.RetrieveCustomer``: %v\n", err)
		fmt.Fprintf(os.Stderr, "Full HTTP response: %v\n", r)
	}
	// response from `RetrieveCustomer`: Customers
	fmt.Fprintf(os.Stdout, "Response from `CustomersAPI.RetrieveCustomer`: %v\n", resp)
}
```

### Path Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
**ctx** | **context.Context** | context for authentication, logging, cancellation, deadlines, tracing, etc.
**customerId** | **string** | Unique identifier for the customer | 

### Other Parameters

Other parameters are passed through a pointer to a apiRetrieveCustomerRequest struct via the builder pattern


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


## UpdateCustomer

> Customers UpdateCustomer(ctx, customerId).CustomersUpdate(customersUpdate).Execute()

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
	customerId := "38400000-8cf0-11bd-b23e-10b96e4ef00d" // string | Unique identifier for the customer
	customersUpdate := *openapiclient.NewCustomersUpdate() // CustomersUpdate | 

	configuration := openapiclient.NewConfiguration()
	apiClient := openapiclient.NewAPIClient(configuration)
	resp, r, err := apiClient.CustomersAPI.UpdateCustomer(context.Background(), customerId).CustomersUpdate(customersUpdate).Execute()
	if err != nil {
		fmt.Fprintf(os.Stderr, "Error when calling `CustomersAPI.UpdateCustomer``: %v\n", err)
		fmt.Fprintf(os.Stderr, "Full HTTP response: %v\n", r)
	}
	// response from `UpdateCustomer`: Customers
	fmt.Fprintf(os.Stdout, "Response from `CustomersAPI.UpdateCustomer`: %v\n", resp)
}
```

### Path Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
**ctx** | **context.Context** | context for authentication, logging, cancellation, deadlines, tracing, etc.
**customerId** | **string** | Unique identifier for the customer | 

### Other Parameters

Other parameters are passed through a pointer to a apiUpdateCustomerRequest struct via the builder pattern


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

