# \SPIAPI

All URIs are relative to *https://api.lomi.africa/v1*

Method | HTTP request | Description
------------- | ------------- | -------------
[**CreateSpiQrCode**](SPIAPI.md#CreateSpiQrCode) | **Post** /spi_qr_codes | Create spi qr code
[**DeleteSpiQrCode**](SPIAPI.md#DeleteSpiQrCode) | **Delete** /spi_qr_codes/{qr_code_id} | Delete spi qr code
[**ListSpiAccountAliases**](SPIAPI.md#ListSpiAccountAliases) | **Get** /spi_account_aliases | List spi account aliases
[**ListSpiQrCodes**](SPIAPI.md#ListSpiQrCodes) | **Get** /spi_qr_codes | List spi qr codes
[**RetrieveSpiAccountAliase**](SPIAPI.md#RetrieveSpiAccountAliase) | **Get** /spi_account_aliases/{alias_id} | Retrieve spi account aliase
[**RetrieveSpiQrCode**](SPIAPI.md#RetrieveSpiQrCode) | **Get** /spi_qr_codes/{qr_code_id} | Retrieve spi qr code
[**UpdateSpiQrCode**](SPIAPI.md#UpdateSpiQrCode) | **Patch** /spi_qr_codes/{qr_code_id} | Update spi qr code



## CreateSpiQrCode

> SpiQrCodes CreateSpiQrCode(ctx).SpiQrCodesCreate(spiQrCodesCreate).Execute()

Create spi qr code



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
	spiQrCodesCreate := *openapiclient.NewSpiQrCodesCreate() // SpiQrCodesCreate | 

	configuration := openapiclient.NewConfiguration()
	apiClient := openapiclient.NewAPIClient(configuration)
	resp, r, err := apiClient.SPIAPI.CreateSpiQrCode(context.Background()).SpiQrCodesCreate(spiQrCodesCreate).Execute()
	if err != nil {
		fmt.Fprintf(os.Stderr, "Error when calling `SPIAPI.CreateSpiQrCode``: %v\n", err)
		fmt.Fprintf(os.Stderr, "Full HTTP response: %v\n", r)
	}
	// response from `CreateSpiQrCode`: SpiQrCodes
	fmt.Fprintf(os.Stdout, "Response from `SPIAPI.CreateSpiQrCode`: %v\n", resp)
}
```

### Path Parameters



### Other Parameters

Other parameters are passed through a pointer to a apiCreateSpiQrCodeRequest struct via the builder pattern


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **spiQrCodesCreate** | [**SpiQrCodesCreate**](SpiQrCodesCreate.md) |  | 

### Return type

[**SpiQrCodes**](SpiQrCodes.md)

### Authorization

[ApiKeyAuth](../README.md#ApiKeyAuth)

### HTTP request headers

- **Content-Type**: application/json
- **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints)
[[Back to Model list]](../README.md#documentation-for-models)
[[Back to README]](../README.md)


## DeleteSpiQrCode

> DeleteSpiQrCode(ctx, qrCodeId).Execute()

Delete spi qr code



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
	qrCodeId := "38400000-8cf0-11bd-b23e-10b96e4ef00d" // string | Unique identifier for the spi qr code

	configuration := openapiclient.NewConfiguration()
	apiClient := openapiclient.NewAPIClient(configuration)
	r, err := apiClient.SPIAPI.DeleteSpiQrCode(context.Background(), qrCodeId).Execute()
	if err != nil {
		fmt.Fprintf(os.Stderr, "Error when calling `SPIAPI.DeleteSpiQrCode``: %v\n", err)
		fmt.Fprintf(os.Stderr, "Full HTTP response: %v\n", r)
	}
}
```

### Path Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
**ctx** | **context.Context** | context for authentication, logging, cancellation, deadlines, tracing, etc.
**qrCodeId** | **string** | Unique identifier for the spi qr code | 

### Other Parameters

Other parameters are passed through a pointer to a apiDeleteSpiQrCodeRequest struct via the builder pattern


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
	resp, r, err := apiClient.SPIAPI.ListSpiAccountAliases(context.Background()).Limit(limit).Offset(offset).Sort(sort).Execute()
	if err != nil {
		fmt.Fprintf(os.Stderr, "Error when calling `SPIAPI.ListSpiAccountAliases``: %v\n", err)
		fmt.Fprintf(os.Stderr, "Full HTTP response: %v\n", r)
	}
	// response from `ListSpiAccountAliases`: ListSpiAccountAliases200Response
	fmt.Fprintf(os.Stdout, "Response from `SPIAPI.ListSpiAccountAliases`: %v\n", resp)
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


## ListSpiQrCodes

> ListSpiQrCodes200Response ListSpiQrCodes(ctx).Limit(limit).Offset(offset).Sort(sort).Execute()

List spi qr codes



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
	resp, r, err := apiClient.SPIAPI.ListSpiQrCodes(context.Background()).Limit(limit).Offset(offset).Sort(sort).Execute()
	if err != nil {
		fmt.Fprintf(os.Stderr, "Error when calling `SPIAPI.ListSpiQrCodes``: %v\n", err)
		fmt.Fprintf(os.Stderr, "Full HTTP response: %v\n", r)
	}
	// response from `ListSpiQrCodes`: ListSpiQrCodes200Response
	fmt.Fprintf(os.Stdout, "Response from `SPIAPI.ListSpiQrCodes`: %v\n", resp)
}
```

### Path Parameters



### Other Parameters

Other parameters are passed through a pointer to a apiListSpiQrCodesRequest struct via the builder pattern


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **limit** | **int32** | Maximum number of items to return (1-100) | [default to 20]
 **offset** | **int32** | Number of items to skip for pagination | [default to 0]
 **sort** | **string** | Sort order. Format: &#x60;field:direction&#x60; (e.g., &#x60;created_at:desc&#x60;) | 

### Return type

[**ListSpiQrCodes200Response**](ListSpiQrCodes200Response.md)

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
	resp, r, err := apiClient.SPIAPI.RetrieveSpiAccountAliase(context.Background(), aliasId).Execute()
	if err != nil {
		fmt.Fprintf(os.Stderr, "Error when calling `SPIAPI.RetrieveSpiAccountAliase``: %v\n", err)
		fmt.Fprintf(os.Stderr, "Full HTTP response: %v\n", r)
	}
	// response from `RetrieveSpiAccountAliase`: SpiAccountAliases
	fmt.Fprintf(os.Stdout, "Response from `SPIAPI.RetrieveSpiAccountAliase`: %v\n", resp)
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


## RetrieveSpiQrCode

> SpiQrCodes RetrieveSpiQrCode(ctx, qrCodeId).Execute()

Retrieve spi qr code



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
	qrCodeId := "38400000-8cf0-11bd-b23e-10b96e4ef00d" // string | Unique identifier for the spi qr code

	configuration := openapiclient.NewConfiguration()
	apiClient := openapiclient.NewAPIClient(configuration)
	resp, r, err := apiClient.SPIAPI.RetrieveSpiQrCode(context.Background(), qrCodeId).Execute()
	if err != nil {
		fmt.Fprintf(os.Stderr, "Error when calling `SPIAPI.RetrieveSpiQrCode``: %v\n", err)
		fmt.Fprintf(os.Stderr, "Full HTTP response: %v\n", r)
	}
	// response from `RetrieveSpiQrCode`: SpiQrCodes
	fmt.Fprintf(os.Stdout, "Response from `SPIAPI.RetrieveSpiQrCode`: %v\n", resp)
}
```

### Path Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
**ctx** | **context.Context** | context for authentication, logging, cancellation, deadlines, tracing, etc.
**qrCodeId** | **string** | Unique identifier for the spi qr code | 

### Other Parameters

Other parameters are passed through a pointer to a apiRetrieveSpiQrCodeRequest struct via the builder pattern


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------


### Return type

[**SpiQrCodes**](SpiQrCodes.md)

### Authorization

[ApiKeyAuth](../README.md#ApiKeyAuth)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints)
[[Back to Model list]](../README.md#documentation-for-models)
[[Back to README]](../README.md)


## UpdateSpiQrCode

> SpiQrCodes UpdateSpiQrCode(ctx, qrCodeId).SpiQrCodesUpdate(spiQrCodesUpdate).Execute()

Update spi qr code



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
	qrCodeId := "38400000-8cf0-11bd-b23e-10b96e4ef00d" // string | Unique identifier for the spi qr code
	spiQrCodesUpdate := *openapiclient.NewSpiQrCodesUpdate() // SpiQrCodesUpdate | 

	configuration := openapiclient.NewConfiguration()
	apiClient := openapiclient.NewAPIClient(configuration)
	resp, r, err := apiClient.SPIAPI.UpdateSpiQrCode(context.Background(), qrCodeId).SpiQrCodesUpdate(spiQrCodesUpdate).Execute()
	if err != nil {
		fmt.Fprintf(os.Stderr, "Error when calling `SPIAPI.UpdateSpiQrCode``: %v\n", err)
		fmt.Fprintf(os.Stderr, "Full HTTP response: %v\n", r)
	}
	// response from `UpdateSpiQrCode`: SpiQrCodes
	fmt.Fprintf(os.Stdout, "Response from `SPIAPI.UpdateSpiQrCode`: %v\n", resp)
}
```

### Path Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
**ctx** | **context.Context** | context for authentication, logging, cancellation, deadlines, tracing, etc.
**qrCodeId** | **string** | Unique identifier for the spi qr code | 

### Other Parameters

Other parameters are passed through a pointer to a apiUpdateSpiQrCodeRequest struct via the builder pattern


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------

 **spiQrCodesUpdate** | [**SpiQrCodesUpdate**](SpiQrCodesUpdate.md) |  | 

### Return type

[**SpiQrCodes**](SpiQrCodes.md)

### Authorization

[ApiKeyAuth](../README.md#ApiKeyAuth)

### HTTP request headers

- **Content-Type**: application/json
- **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints)
[[Back to Model list]](../README.md#documentation-for-models)
[[Back to README]](../README.md)

