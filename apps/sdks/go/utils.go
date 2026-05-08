package lomi

import "net/url"

func paramsToQuery(params map[string]string) url.Values {
	if params == nil || len(params) == 0 {
		return nil
	}
	q := url.Values{}
	for k, v := range params {
		q.Set(k, v)
	}
	return q
}
