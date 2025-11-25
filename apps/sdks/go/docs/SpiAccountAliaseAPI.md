# \SpiAccountAliaseAPI

All URIs are relative to *https://api.lomi.africa/v1*

Method | HTTP request | Description
------------- | ------------- | -------------
[**SpiAccountAliasesAliasIdGet**](SpiAccountAliaseAPI.md#SpiAccountAliasesAliasIdGet) | **Get** /spi_account_aliases/{alias_id} | Get spi_account_aliase
[**SpiAccountAliasesGet**](SpiAccountAliaseAPI.md#SpiAccountAliasesGet) | **Get** /spi_account_aliases | List spi_account_aliases



## SpiAccountAliasesAliasIdGet

> SpiAccountAliases SpiAccountAliasesAliasIdGet(ctx, aliasId).Execute()

Get spi_account_aliase



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
	aliasId := "38400000-8cf0-11bd-b23e-10b96e4ef00d" // string | The spi_account_aliase ID

	configuration := openapiclient.NewConfiguration()
	apiClient := openapiclient.NewAPIClient(configuration)
	resp, r, err := apiClient.SpiAccountAliaseAPI.SpiAccountAliasesAliasIdGet(context.Background(), aliasId).Execute()
	if err != nil {
		fmt.Fprintf(os.Stderr, "Error when calling `SpiAccountAliaseAPI.SpiAccountAliasesAliasIdGet``: %v\n", err)
		fmt.Fprintf(os.Stderr, "Full HTTP response: %v\n", r)
	}
	// response from `SpiAccountAliasesAliasIdGet`: SpiAccountAliases
	fmt.Fprintf(os.Stdout, "Response from `SpiAccountAliaseAPI.SpiAccountAliasesAliasIdGet`: %v\n", resp)
}
```

### Path Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
**ctx** | **context.Context** | context for authentication, logging, cancellation, deadlines, tracing, etc.
**aliasId** | **string** | The spi_account_aliase ID | 

### Other Parameters

Other parameters are passed through a pointer to a apiSpiAccountAliasesAliasIdGetRequest struct via the builder pattern


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


## SpiAccountAliasesGet

> SpiAccountAliasesGet200Response SpiAccountAliasesGet(ctx).Limit(limit).Offset(offset).Sort(sort).Execute()

List spi_account_aliases



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
	resp, r, err := apiClient.SpiAccountAliaseAPI.SpiAccountAliasesGet(context.Background()).Limit(limit).Offset(offset).Sort(sort).Execute()
	if err != nil {
		fmt.Fprintf(os.Stderr, "Error when calling `SpiAccountAliaseAPI.SpiAccountAliasesGet``: %v\n", err)
		fmt.Fprintf(os.Stderr, "Full HTTP response: %v\n", r)
	}
	// response from `SpiAccountAliasesGet`: SpiAccountAliasesGet200Response
	fmt.Fprintf(os.Stdout, "Response from `SpiAccountAliaseAPI.SpiAccountAliasesGet`: %v\n", resp)
}
```

### Path Parameters



### Other Parameters

Other parameters are passed through a pointer to a apiSpiAccountAliasesGetRequest struct via the builder pattern


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **limit** | **int32** | Maximum number of items to return | [default to 20]
 **offset** | **int32** | Number of items to skip | [default to 0]
 **sort** | **string** | Sort order (e.g., created_at:desc) | 

### Return type

[**SpiAccountAliasesGet200Response**](SpiAccountAliasesGet200Response.md)

### Authorization

[ApiKeyAuth](../README.md#ApiKeyAuth)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints)
[[Back to Model list]](../README.md#documentation-for-models)
[[Back to README]](../README.md)

