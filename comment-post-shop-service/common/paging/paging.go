package paging

type Paging struct {
	Page   int  `json:"page"`
	Limit  int  `json:"limit"`
	Cursor *int `json:"cursor"`
}

func (p *Paging) Validate() {
	if p.Page <= 0 {
		p.Page = 1
	}
	if p.Limit <= 0 {
		p.Limit = 10
	}
}
