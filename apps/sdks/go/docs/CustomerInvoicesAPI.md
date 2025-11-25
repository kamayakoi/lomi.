# \CustomerInvoicesAPI

All URIs are relative to *https://api.lomi.africa/v1*

Method | HTTP request | Description
------------- | ------------- | -------------
[**ListCustomerInvoices**](CustomerInvoicesAPI.md#ListCustomerInvoices) | **Get** /customer_invoices | List customer invoices
[**RetrieveCustomerInvoice**](CustomerInvoicesAPI.md#RetrieveCustomerInvoice) | **Get** /customer_invoices/{invoice_id} | Retrieve customer invoice



## ListCustomerInvoices

> ListCustomerInvoices200Response ListCustomerInvoices(ctx).Limit(limit).Offset(offset).Sort(sort).Execute()

List customer invoices



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
	resp, r, err := apiClient.CustomerInvoicesAPI.ListCustomerInvoices(context.Background()).Limit(limit).Offset(offset).Sort(sort).Execute()
	if err != nil {
		fmt.Fprintf(os.Stderr, "Error when calling `CustomerInvoicesAPI.ListCustomerInvoices``: %v\n", err)
		fmt.Fprintf(os.Stderr, "Full HTTP response: %v\n", r)
	}
	// response from `ListCustomerInvoices`: ListCustomerInvoices200Response
	fmt.Fprintf(os.Stdout, "Response from `CustomerInvoicesAPI.ListCustomerInvoices`: %v\n", resp)
}
```

### Path Parameters



### Other Parameters

Other parameters are passed through a pointer to a apiListCustomerInvoicesRequest struct via the builder pattern


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **limit** | **int32** | Maximum number of items to return (1-100) | [default to 20]
 **offset** | **int32** | Number of items to skip for pagination | [default to 0]
 **sort** | **string** | Sort order. Format: &#x60;field:direction&#x60; (e.g., &#x60;created_at:desc&#x60;) | 

### Return type

[**ListCustomerInvoices200Response**](ListCustomerInvoices200Response.md)

### Authorization

[ApiKeyAuth](../README.md#ApiKeyAuth)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints)
[[Back to Model list]](../README.md#documentation-for-models)
[[Back to README]](../README.md)


## RetrieveCustomerInvoice

> CustomerInvoices RetrieveCustomerInvoice(ctx, invoiceId).Execute()

Retrieve customer invoice



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
	invoiceId := "38400000-8cf0-11bd-b23e-10b96e4ef00d" // string | Unique identifier for the customer invoice

	configuration := openapiclient.NewConfiguration()
	apiClient := openapiclient.NewAPIClient(configuration)
	resp, r, err := apiClient.CustomerInvoicesAPI.RetrieveCustomerInvoice(context.Background(), invoiceId).Execute()
	if err != nil {
		fmt.Fprintf(os.Stderr, "Error when calling `CustomerInvoicesAPI.RetrieveCustomerInvoice``: %v\n", err)
		fmt.Fprintf(os.Stderr, "Full HTTP response: %v\n", r)
	}
	// response from `RetrieveCustomerInvoice`: CustomerInvoices
	fmt.Fprintf(os.Stdout, "Response from `CustomerInvoicesAPI.RetrieveCustomerInvoice`: %v\n", resp)
}
```

### Path Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
**ctx** | **context.Context** | context for authentication, logging, cancellation, deadlines, tracing, etc.
**invoiceId** | **string** | Unique identifier for the customer invoice | 

### Other Parameters

Other parameters are passed through a pointer to a apiRetrieveCustomerInvoiceRequest struct via the builder pattern


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

