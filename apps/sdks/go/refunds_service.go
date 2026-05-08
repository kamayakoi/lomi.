// AUTO-GENERATED — public merchant allowlist
package lomi

import (
	"encoding/json"
)

type RefundsService struct {
	client *Client
}

func (s *RefundsService) CreateWaveRefund() (interface{}, error) {
		path := "/refund/wave"
		bodyResp, err := s.client.doRequest("POST", path, nil, nil)
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

