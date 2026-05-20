// AUTO-GENERATED — public merchant allowlist
package lomi

import (
	"encoding/json"
)

type ProvidersService struct {
	client *Client
}

func (s *ProvidersService) List(params map[string]string) (interface{}, error) {
		path := "/providers"
		bodyResp, err := s.client.doRequest("GET", path, paramsToQuery(params), nil)
		if err != nil {
			return nil, err
		}
		if len(bodyResp) == 0 {
			return nil, nil
		}
		var out interface{}
		if err := json.Unmarshal(bodyResp, &out); err != nil {
			return nil, err
		}
		return out, nil
	}

