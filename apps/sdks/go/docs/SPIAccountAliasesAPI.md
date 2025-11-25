# \SPIAccountAliasesAPI

All URIs are relative to *https://api.lomi.africa/v1*

Method | HTTP request | Description
------------- | ------------- | -------------
[**ListSpiAccountAliases**](SPIAccountAliasesAPI.md#ListSpiAccountAliases) | **Get** /spi_account_aliases | List spi account aliases
[**RetrieveSpiAccountAliase**](SPIAccountAliasesAPI.md#RetrieveSpiAccountAliase) | **Get** /spi_account_aliases/{alias_id} | Retrieve spi account aliase



## ListSpiAccountAliases

> ListSpiAccountAliases200Response ListSpiAccountAliases(ctx).Limit(limit).Offset(offset).Sort(sort).Execute()

List spi account aliases



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
	resp, r, err := apiClient.SPIAccountAliasesAPI.ListSpiAccountAliases(context.Background()).Limit(limit).Offset(offset).Sort(sort).Execute()
	if err != nil {
		fmt.Fprintf(os.Stderr, "Error when calling `SPIAccountAliasesAPI.ListSpiAccountAliases``: %v\n", err)
		fmt.Fprintf(os.Stderr, "Full HTTP response: %v\n", r)
	}
	// response from `ListSpiAccountAliases`: ListSpiAccountAliases200Response
	fmt.Fprintf(os.Stdout, "Response from `SPIAccountAliasesAPI.ListSpiAccountAliases`: %v\n", resp)
}
```

### Path Parameters



### Other Parameters

Other parameters are passed through a pointer to a apiListSpiAccountAliasesRequest struct via the builder pattern


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **limit** | **int32** | Maximum number of items to return (1-100) | [default to 20]
 **offset** | **int32** | Number of items to skip for pagination | [default to 0]
 **sort** | **string** | Sort order. Format: &#x60;field:direction&#x60; (e.g., &#x60;created_at:desc&#x60;) | 

### Return type

[**ListSpiAccountAliases200Response**](ListSpiAccountAliases200Response.md)

### Authorization

[ApiKeyAuth](../README.md#ApiKeyAuth)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints)
[[Back to Model list]](../README.md#documentation-for-models)
[[Back to README]](../README.md)


## RetrieveSpiAccountAliase

> SpiAccountAliases RetrieveSpiAccountAliase(ctx, aliasId).Execute()

Retrieve spi account aliase



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
	aliasId := "38400000-8cf0-11bd-b23e-10b96e4ef00d" // string | Unique identifier for the spi account aliase

	configuration := openapiclient.NewConfiguration()
	apiClient := openapiclient.NewAPIClient(configuration)
	resp, r, err := apiClient.SPIAccountAliasesAPI.RetrieveSpiAccountAliase(context.Background(), aliasId).Execute()
	if err != nil {
		fmt.Fprintf(os.Stderr, "Error when calling `SPIAccountAliasesAPI.RetrieveSpiAccountAliase``: %v\n", err)
		fmt.Fprintf(os.Stderr, "Full HTTP response: %v\n", r)
	}
	// response from `RetrieveSpiAccountAliase`: SpiAccountAliases
	fmt.Fprintf(os.Stdout, "Response from `SPIAccountAliasesAPI.RetrieveSpiAccountAliase`: %v\n", resp)
}
```

### Path Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
**ctx** | **context.Context** | context for authentication, logging, cancellation, deadlines, tracing, etc.
**aliasId** | **string** | Unique identifier for the spi account aliase | 

### Other Parameters

Other parameters are passed through a pointer to a apiRetrieveSpiAccountAliaseRequest struct via the builder pattern


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------


### Return type

[**SpiAccountAliases**](SpiAccountAliases.md)

### Authorization

[ApiKeyAuth](../README.md#ApiKeyAuth)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints)
[[Back to Model list]](../README.md#documentation-for-models)
[[Back to README]](../README.md)

