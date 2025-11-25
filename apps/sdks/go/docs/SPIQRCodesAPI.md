# \SPIQRCodesAPI

All URIs are relative to *https://api.lomi.africa/v1*

Method | HTTP request | Description
------------- | ------------- | -------------
[**CreateSpiQrCode**](SPIQRCodesAPI.md#CreateSpiQrCode) | **Post** /spi_qr_codes | Create spi qr code
[**DeleteSpiQrCode**](SPIQRCodesAPI.md#DeleteSpiQrCode) | **Delete** /spi_qr_codes/{qr_code_id} | Delete spi qr code
[**ListSpiQrCodes**](SPIQRCodesAPI.md#ListSpiQrCodes) | **Get** /spi_qr_codes | List spi qr codes
[**RetrieveSpiQrCode**](SPIQRCodesAPI.md#RetrieveSpiQrCode) | **Get** /spi_qr_codes/{qr_code_id} | Retrieve spi qr code
[**UpdateSpiQrCode**](SPIQRCodesAPI.md#UpdateSpiQrCode) | **Patch** /spi_qr_codes/{qr_code_id} | Update spi qr code



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
	resp, r, err := apiClient.SPIQRCodesAPI.CreateSpiQrCode(context.Background()).SpiQrCodesCreate(spiQrCodesCreate).Execute()
	if err != nil {
		fmt.Fprintf(os.Stderr, "Error when calling `SPIQRCodesAPI.CreateSpiQrCode``: %v\n", err)
		fmt.Fprintf(os.Stderr, "Full HTTP response: %v\n", r)
	}
	// response from `CreateSpiQrCode`: SpiQrCodes
	fmt.Fprintf(os.Stdout, "Response from `SPIQRCodesAPI.CreateSpiQrCode`: %v\n", resp)
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
	r, err := apiClient.SPIQRCodesAPI.DeleteSpiQrCode(context.Background(), qrCodeId).Execute()
	if err != nil {
		fmt.Fprintf(os.Stderr, "Error when calling `SPIQRCodesAPI.DeleteSpiQrCode``: %v\n", err)
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
	resp, r, err := apiClient.SPIQRCodesAPI.ListSpiQrCodes(context.Background()).Limit(limit).Offset(offset).Sort(sort).Execute()
	if err != nil {
		fmt.Fprintf(os.Stderr, "Error when calling `SPIQRCodesAPI.ListSpiQrCodes``: %v\n", err)
		fmt.Fprintf(os.Stderr, "Full HTTP response: %v\n", r)
	}
	// response from `ListSpiQrCodes`: ListSpiQrCodes200Response
	fmt.Fprintf(os.Stdout, "Response from `SPIQRCodesAPI.ListSpiQrCodes`: %v\n", resp)
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
	resp, r, err := apiClient.SPIQRCodesAPI.RetrieveSpiQrCode(context.Background(), qrCodeId).Execute()
	if err != nil {
		fmt.Fprintf(os.Stderr, "Error when calling `SPIQRCodesAPI.RetrieveSpiQrCode``: %v\n", err)
		fmt.Fprintf(os.Stderr, "Full HTTP response: %v\n", r)
	}
	// response from `RetrieveSpiQrCode`: SpiQrCodes
	fmt.Fprintf(os.Stdout, "Response from `SPIQRCodesAPI.RetrieveSpiQrCode`: %v\n", resp)
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
	resp, r, err := apiClient.SPIQRCodesAPI.UpdateSpiQrCode(context.Background(), qrCodeId).SpiQrCodesUpdate(spiQrCodesUpdate).Execute()
	if err != nil {
		fmt.Fprintf(os.Stderr, "Error when calling `SPIQRCodesAPI.UpdateSpiQrCode``: %v\n", err)
		fmt.Fprintf(os.Stderr, "Full HTTP response: %v\n", r)
	}
	// response from `UpdateSpiQrCode`: SpiQrCodes
	fmt.Fprintf(os.Stdout, "Response from `SPIQRCodesAPI.UpdateSpiQrCode`: %v\n", resp)
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

