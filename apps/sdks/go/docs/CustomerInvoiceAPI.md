# \CustomerInvoiceAPI

All URIs are relative to *https://api.lomi.africa/v1*

Method | HTTP request | Description
------------- | ------------- | -------------
[**CustomerInvoicesGet**](CustomerInvoiceAPI.md#CustomerInvoicesGet) | **Get** /customer_invoices | List customer_invoices
[**CustomerInvoicesInvoiceIdGet**](CustomerInvoiceAPI.md#CustomerInvoicesInvoiceIdGet) | **Get** /customer_invoices/{invoice_id} | Get customer_invoice



## CustomerInvoicesGet

> CustomerInvoicesGet200Response CustomerInvoicesGet(ctx).Limit(limit).Offset(offset).Sort(sort).Execute()

List customer_invoices



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
	resp, r, err := apiClient.CustomerInvoiceAPI.CustomerInvoicesGet(context.Background()).Limit(limit).Offset(offset).Sort(sort).Execute()
	if err != nil {
		fmt.Fprintf(os.Stderr, "Error when calling `CustomerInvoiceAPI.CustomerInvoicesGet``: %v\n", err)
		fmt.Fprintf(os.Stderr, "Full HTTP response: %v\n", r)
	}
	// response from `CustomerInvoicesGet`: CustomerInvoicesGet200Response
	fmt.Fprintf(os.Stdout, "Response from `CustomerInvoiceAPI.CustomerInvoicesGet`: %v\n", resp)
}
```

### Path Parameters



### Other Parameters

Other parameters are passed through a pointer to a apiCustomerInvoicesGetRequest struct via the builder pattern


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **limit** | **int32** | Maximum number of items to return | [default to 20]
 **offset** | **int32** | Number of items to skip | [default to 0]
 **sort** | **string** | Sort order (e.g., created_at:desc) | 

### Return type

[**CustomerInvoicesGet200Response**](CustomerInvoicesGet200Response.md)

### Authorization

[ApiKeyAuth](../README.md#ApiKeyAuth)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints)
[[Back to Model list]](../README.md#documentation-for-models)
[[Back to README]](../README.md)


## CustomerInvoicesInvoiceIdGet

> CustomerInvoices CustomerInvoicesInvoiceIdGet(ctx, invoiceId).Execute()

Get customer_invoice



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
	invoiceId := "38400000-8cf0-11bd-b23e-10b96e4ef00d" // string | The customer_invoice ID

	configuration := openapiclient.NewConfiguration()
	apiClient := openapiclient.NewAPIClient(configuration)
	resp, r, err := apiClient.CustomerInvoiceAPI.CustomerInvoicesInvoiceIdGet(context.Background(), invoiceId).Execute()
	if err != nil {
		fmt.Fprintf(os.Stderr, "Error when calling `CustomerInvoiceAPI.CustomerInvoicesInvoiceIdGet``: %v\n", err)
		fmt.Fprintf(os.Stderr, "Full HTTP response: %v\n", r)
	}
	// response from `CustomerInvoicesInvoiceIdGet`: CustomerInvoices
	fmt.Fprintf(os.Stdout, "Response from `CustomerInvoiceAPI.CustomerInvoicesInvoiceIdGet`: %v\n", resp)
}
```

### Path Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
**ctx** | **context.Context** | context for authentication, logging, cancellation, deadlines, tracing, etc.
**invoiceId** | **string** | The customer_invoice ID | 

### Other Parameters

Other parameters are passed through a pointer to a apiCustomerInvoicesInvoiceIdGetRequest struct via the builder pattern


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------


### Return type

[**CustomerInvoices**](CustomerInvoices.md)

### Authorization

[ApiKeyAuth](../README.md#ApiKeyAuth)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints)
[[Back to Model list]](../README.md#documentation-for-models)
[[Back to README]](../README.md)

