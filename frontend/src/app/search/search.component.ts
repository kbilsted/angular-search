import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-search',
    templateUrl: './search.component.html',
    styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {
    public searchResult;

    constructor() { }

    ngOnInit() {
        this.searchResult = JSON.parse(`
{
  "filters":
  {
    "required":[ {"column": "Eventid", "value": "123"}],
    "excluded":[{"column":"TransactionId", "value": "aa"}]
  },
  "columns":["firstname","surname"],
  "lines":
  [
      {
        "name":"Barry",
        "surname":"White"
      },
      {
        "name":"Peter",
        "surname":"Meyer"
      }
  ]
}`);
    }

    clearSearchFilters() {
        this.searchResult.filters.required = [];
        this.searchResult.filters.excluded = [];
    }

    clearRequired(idx) {
        this.searchResult.filters.required.splice(idx, 1);
    }

    clearExcluded(idx) {
        this.searchResult.filters.excluded.splice(idx, 1);
    }

    addIfNotExist(collectionToAddTo, item, compareValue) {
        var cmp = function (val) { return val.value == compareValue };

        var found = this.searchResult.filters.required.some(cmp) || this.searchResult.filters.excluded.some(cmp);

        if (!found) {
            collectionToAddTo.push(item);
        }
    }

    addRequireFilter(idx, cellvalue) {
        var item = { column: this.searchResult.columns[idx], value: cellvalue };
        this.addIfNotExist(this.searchResult.filters.required, item, cellvalue);
    }

    addExcludedFilter(idx, cellvalue) {
        var item = { column: this.searchResult.columns[idx], value: cellvalue };
        this.addIfNotExist(this.searchResult.filters.excluded, item, cellvalue);
    }

}
