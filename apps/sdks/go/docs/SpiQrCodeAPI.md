# \SpiQrCodeAPI

All URIs are relative to *https://api.lomi.africa/v1*

Method | HTTP request | Description
------------- | ------------- | -------------
[**SpiQrCodesGet**](SpiQrCodeAPI.md#SpiQrCodesGet) | **Get** /spi_qr_codes | List spi_qr_codes
[**SpiQrCodesPost**](SpiQrCodeAPI.md#SpiQrCodesPost) | **Post** /spi_qr_codes | Create spi_qr_code
[**SpiQrCodesQrCodeIdDelete**](SpiQrCodeAPI.md#SpiQrCodesQrCodeIdDelete) | **Delete** /spi_qr_codes/{qr_code_id} | Delete spi_qr_code
[**SpiQrCodesQrCodeIdGet**](SpiQrCodeAPI.md#SpiQrCodesQrCodeIdGet) | **Get** /spi_qr_codes/{qr_code_id} | Get spi_qr_code
[**SpiQrCodesQrCodeIdPatch**](SpiQrCodeAPI.md#SpiQrCodesQrCodeIdPatch) | **Patch** /spi_qr_codes/{qr_code_id} | Update spi_qr_code



## SpiQrCodesGet

> SpiQrCodesGet200Response SpiQrCodesGet(ctx).Limit(limit).Offset(offset).Sort(sort).Execute()

List spi_qr_codes



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
	resp, r, err := apiClient.SpiQrCodeAPI.SpiQrCodesGet(context.Background()).Limit(limit).Offset(offset).Sort(sort).Execute()
	if err != nil {
		fmt.Fprintf(os.Stderr, "Error when calling `SpiQrCodeAPI.SpiQrCodesGet``: %v\n", err)
		fmt.Fprintf(os.Stderr, "Full HTTP response: %v\n", r)
	}
	// response from `SpiQrCodesGet`: SpiQrCodesGet200Response
	fmt.Fprintf(os.Stdout, "Response from `SpiQrCodeAPI.SpiQrCodesGet`: %v\n", resp)
}
```

### Path Parameters



### Other Parameters

Other parameters are passed through a pointer to a apiSpiQrCodesGetRequest struct via the builder pattern


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **limit** | **int32** | Maximum number of items to return | [default to 20]
 **offset** | **int32** | Number of items to skip | [default to 0]
 **sort** | **string** | Sort order (e.g., created_at:desc) | 

### Return type

[**SpiQrCodesGet200Response**](SpiQrCodesGet200Response.md)

### Authorization

[ApiKeyAuth](../README.md#ApiKeyAuth)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints)
[[Back to Model list]](../README.md#documentation-for-models)
[[Back to README]](../README.md)


## SpiQrCodesPost

> SpiQrCodes SpiQrCodesPost(ctx).SpiQrCodesCreate(spiQrCodesCreate).Execute()

Create spi_qr_code



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
	resp, r, err := apiClient.SpiQrCodeAPI.SpiQrCodesPost(context.Background()).SpiQrCodesCreate(spiQrCodesCreate).Execute()
	if err != nil {
		fmt.Fprintf(os.Stderr, "Error when calling `SpiQrCodeAPI.SpiQrCodesPost``: %v\n", err)
		fmt.Fprintf(os.Stderr, "Full HTTP response: %v\n", r)
	}
	// response from `SpiQrCodesPost`: SpiQrCodes
	fmt.Fprintf(os.Stdout, "Response from `SpiQrCodeAPI.SpiQrCodesPost`: %v\n", resp)
}
```

### Path Parameters



### Other Parameters

Other parameters are passed through a pointer to a apiSpiQrCodesPostRequest struct via the builder pattern


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


## SpiQrCodesQrCodeIdDelete

> SpiQrCodesQrCodeIdDelete(ctx, qrCodeId).Execute()

Delete spi_qr_code



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
	qrCodeId := "38400000-8cf0-11bd-b23e-10b96e4ef00d" // string | The spi_qr_code ID

	configuration := openapiclient.NewConfiguration()
	apiClient := openapiclient.NewAPIClient(configuration)
	r, err := apiClient.SpiQrCodeAPI.SpiQrCodesQrCodeIdDelete(context.Background(), qrCodeId).Execute()
	if err != nil {
		fmt.Fprintf(os.Stderr, "Error when calling `SpiQrCodeAPI.SpiQrCodesQrCodeIdDelete``: %v\n", err)
		fmt.Fprintf(os.Stderr, "Full HTTP response: %v\n", r)
	}
}
```

### Path Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
**ctx** | **context.Context** | context for authentication, logging, cancellation, deadlines, tracing, etc.
**qrCodeId** | **string** | The spi_qr_code ID | 

### Other Parameters

Other parameters are passed through a pointer to a apiSpiQrCodesQrCodeIdDeleteRequest struct via the builder pattern


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


## SpiQrCodesQrCodeIdGet

> SpiQrCodes SpiQrCodesQrCodeIdGet(ctx, qrCodeId).Execute()

Get spi_qr_code



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
	qrCodeId := "38400000-8cf0-11bd-b23e-10b96e4ef00d" // string | The spi_qr_code ID

	configuration := openapiclient.NewConfiguration()
	apiClient := openapiclient.NewAPIClient(configuration)
	resp, r, err := apiClient.SpiQrCodeAPI.SpiQrCodesQrCodeIdGet(context.Background(), qrCodeId).Execute()
	if err != nil {
		fmt.Fprintf(os.Stderr, "Error when calling `SpiQrCodeAPI.SpiQrCodesQrCodeIdGet``: %v\n", err)
		fmt.Fprintf(os.Stderr, "Full HTTP response: %v\n", r)
	}
	// response from `SpiQrCodesQrCodeIdGet`: SpiQrCodes
	fmt.Fprintf(os.Stdout, "Response from `SpiQrCodeAPI.SpiQrCodesQrCodeIdGet`: %v\n", resp)
}
```

### Path Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
**ctx** | **context.Context** | context for authentication, logging, cancellation, deadlines, tracing, etc.
**qrCodeId** | **string** | The spi_qr_code ID | 

### Other Parameters

Other parameters are passed through a pointer to a apiSpiQrCodesQrCodeIdGetRequest struct via the builder pattern


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


## SpiQrCodesQrCodeIdPatch

> SpiQrCodes SpiQrCodesQrCodeIdPatch(ctx, qrCodeId).SpiQrCodesUpdate(spiQrCodesUpdate).Execute()

Update spi_qr_code



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
	qrCodeId := "38400000-8cf0-11bd-b23e-10b96e4ef00d" // string | The spi_qr_code ID
	spiQrCodesUpdate := *openapiclient.NewSpiQrCodesUpdate() // SpiQrCodesUpdate | 

	configuration := openapiclient.NewConfiguration()
	apiClient := openapiclient.NewAPIClient(configuration)
	resp, r, err := apiClient.SpiQrCodeAPI.SpiQrCodesQrCodeIdPatch(context.Background(), qrCodeId).SpiQrCodesUpdate(spiQrCodesUpdate).Execute()
	if err != nil {
		fmt.Fprintf(os.Stderr, "Error when calling `SpiQrCodeAPI.SpiQrCodesQrCodeIdPatch``: %v\n", err)
		fmt.Fprintf(os.Stderr, "Full HTTP response: %v\n", r)
	}
	// response from `SpiQrCodesQrCodeIdPatch`: SpiQrCodes
	fmt.Fprintf(os.Stdout, "Response from `SpiQrCodeAPI.SpiQrCodesQrCodeIdPatch`: %v\n", resp)
}
```

### Path Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
**ctx** | **context.Context** | context for authentication, logging, cancellation, deadlines, tracing, etc.
**qrCodeId** | **string** | The spi_qr_code ID | 

### Other Parameters

Other parameters are passed through a pointer to a apiSpiQrCodesQrCodeIdPatchRequest struct via the builder pattern


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

