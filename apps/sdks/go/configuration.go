// AUTO-GENERATED — public merchant allowlist SDK
package lomi

import "net/http"

const (
	DefaultBaseURL   = "https://api.lomi.africa"
	SandboxBaseURL   = "https://sandbox.api.lomi.africa"
)

type ClientOption func(*Client)

func WithBaseURL(url string) ClientOption {
	return func(c *Client) {
		c.BaseURL = url
	}
}

func WithSandbox() ClientOption {
	return func(c *Client) {
		c.BaseURL = SandboxBaseURL
	}
}

func WithHTTPClient(client *http.Client) ClientOption {
	return func(c *Client) {
		c.HTTPClient = client
	}
}
