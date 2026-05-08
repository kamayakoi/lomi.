package lomi

import "testing"

func TestNewClient(t *testing.T) {
	c := NewClient("k")
	if c.APIKey != "k" {
		t.Fatal("api key")
	}
	if c.BaseURL != DefaultBaseURL {
		t.Fatal("base url")
	}
}

func TestWithSandbox(t *testing.T) {
	c := NewClient("k", WithSandbox())
	if c.BaseURL != SandboxBaseURL {
		t.Fatal("sandbox")
	}
}
