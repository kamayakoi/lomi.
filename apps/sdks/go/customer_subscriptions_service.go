// AUTO-GENERATED — public merchant allowlist
package lomi

import (
	"encoding/json"
	"strings"
)

type CustomerSubscriptionsService struct {
	client *Client
}

func (s *CustomerSubscriptionsService) Delete(subscription_id string) (interface{}, error) {
		path := "/customer-subscriptions/{subscription_id}"
		path = strings.ReplaceAll(path, "{subscription_id}", subscription_id)
		bodyResp, err := s.client.doRequest("DELETE", path, nil, nil)
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


func (s *CustomerSubscriptionsService) Get(subscription_id string) (interface{}, error) {
		path := "/customer-subscriptions/{subscription_id}"
		path = strings.ReplaceAll(path, "{subscription_id}", subscription_id)
		bodyResp, err := s.client.doRequest("GET", path, nil, nil)
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


func (s *CustomerSubscriptionsService) List(params map[string]string) (interface{}, error) {
		path := "/customer-subscriptions"
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


func (s *CustomerSubscriptionsService) Update(subscription_id string) (interface{}, error) {
		path := "/customer-subscriptions/{subscription_id}"
		path = strings.ReplaceAll(path, "{subscription_id}", subscription_id)
		bodyResp, err := s.client.doRequest("PATCH", path, nil, nil)
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

