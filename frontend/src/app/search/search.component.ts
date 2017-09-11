import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-search',
    templateUrl: './search.component.html',
    styleUrls: ['./search.component.css']
})

export class SearchComponent implements OnInit {
    public searchResult;
    public searchRequest;
    public shareUrl;

    constructor() { }

  private jsonFromServer = `
{
  "filters":
  {
    "required":[ {"column": "Eventid", "value": "123"}],
    "excluded":[{"column":"TransactionId", "value": "aa"}]
  },
  "columns":["firstname","surname"],
  "lines":
  [
    [ "Barry", "White" ],
    [ "PEter", "Meyer" ],
    [ "Barry", "White" ],
    [ "PEter", "Meyer" ],
    [ "Barry", "White" ],
    [ "PEter", "Meyer" ],
    [ "Barry", "White" ],
    [ "PEter9", "Meyer" ],
    [ "Barry8", "White" ],
    [ "PEter7", "Meyer" ],
    [ "Barry6", "White" ],
    [ "PEter5", "Meyer" ],
    [ "Barry4", "White" ],
    [ "PEter3", "Meyer" ],
    [ "Barry2", "White" ],
    [ "PEter1", "Meyer" ],
    [ "PEter1", "Sellers" ]
]
}`;

    updateShareUrl() {
        let args = encodeURIComponent(JSON.stringify((this.searchRequest)));
        let proto = window.location.protocol
        let base = window.location.host
        this.shareUrl = proto + '//' + base +'?searchRequest=' + args;
    }

    getGetParameter()
    {
        var normalizedQueryString = window.location.search;
        if (normalizedQueryString.indexOf('?') == 0) {
            normalizedQueryString = normalizedQueryString.substring(1);
        }
        var params = new URLSearchParams(normalizedQueryString).get('searchRequest');
        console.log("url1 " + params);

        return params;
    }

    ngOnInit() {
        this.searchResult = JSON.parse(this.jsonFromServer);

        let params = this.getGetParameter();
        if (params == null) {
            this.searchRequest = {
                required: this.searchResult.filters.required,
                excluded: this.searchResult.filters.excluded,
            }
        }
        else {
            params = decodeURIComponent(params);
            console.log("url2 " + params);
            this.searchRequest = JSON.parse(params);
        }

        this.updateShareUrl();
    }

    clearSearchFilters() {
      this.searchRequest.required = [];
      this.searchRequest.excluded = [];
      this.updateShareUrl();
    }

    clearRequired(idx) {
      this.searchRequest.required.splice(idx, 1);
      this.updateShareUrl();
    }

    clearExcluded(idx) {
      this.searchRequest.excluded.splice(idx, 1);
      this.updateShareUrl();
    }

    addIfNotExist(collectionToAddTo, item, compareValue) {
        var cmp = function (val) { return val.value == compareValue };

        var found = this.searchRequest.required.some(cmp) || this.searchRequest.excluded.some(cmp);

        if (!found) {
            collectionToAddTo.push(item);
        }

        this.updateShareUrl();
    }

    addRequireFilter(idx, cellvalue) {
        var item = { column: this.searchResult.columns[idx], value: cellvalue };
        this.addIfNotExist(this.searchRequest.required, item, cellvalue);
    }

    addExcludedFilter(idx, cellvalue) {
        var item = { column: this.searchResult.columns[idx], value: cellvalue };
        this.addIfNotExist(this.searchRequest.excluded, item, cellvalue);
    }
}
