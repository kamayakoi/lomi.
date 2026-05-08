// AUTO-GENERATED — public merchant allowlist
package lomi

import (
	"encoding/json"
	"strings"
)

type DiscountCouponsService struct {
	client *Client
}

func (s *DiscountCouponsService) Create() (interface{}, error) {
		path := "/discount-coupons"
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


func (s *DiscountCouponsService) Get(id string) (interface{}, error) {
		path := "/discount-coupons/{id}"
		path = strings.ReplaceAll(path, "{id}", id)
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


func (s *DiscountCouponsService) GetPerformance(id string) (interface{}, error) {
		path := "/discount-coupons/{id}/performance"
		path = strings.ReplaceAll(path, "{id}", id)
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


func (s *DiscountCouponsService) List() (interface{}, error) {
		path := "/discount-coupons"
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

