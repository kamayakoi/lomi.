// AUTO-GENERATED — public merchant allowlist
package lomi

import (
	"encoding/json"
)

type PayoutsService struct {
	client *Client
}

func (s *PayoutsService) CreateWavePayout() (interface{}, error) {
		path := "/payout/wave"
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


func (s *PayoutsService) List(params map[string]string) (interface{}, error) {
		path := "/payouts"
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

