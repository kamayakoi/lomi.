// AUTO-GENERATED — public merchant allowlist
package lomi

import (
	"encoding/json"
)

type PaymentIntentsService struct {
	client *Client
}

func (s *PaymentIntentsService) Create(body interface{}) (interface{}, error) {
		path := "/payment-intents"
		bodyResp, err := s.client.doRequest("POST", path, nil, body)
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

