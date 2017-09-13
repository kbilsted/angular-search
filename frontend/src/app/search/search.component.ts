import { Component, OnInit } from '@angular/core';

// First we import the classes required
import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Headers, RequestOptions } from '@angular/http';

// All the RxJS stuff we need
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

@Component({
    selector: 'app-search',
    templateUrl: './search.component.html',
    styleUrls: ['./search.component.css']
})

export class SearchComponent implements OnInit {
    public searchResult;
    public searchRequest;
    public shareUrl : string;
    public databases : string[];

    private backendUrl = 'http://localhost:62907/';

    constructor(private http: Http) {
    }

  private jsonFromServer = `
{
  "columns":[],
  "lines":  []
}`;

    updateShareUrl() {
        let args = encodeURIComponent(JSON.stringify((this.searchRequest)));
        let proto = window.location.protocol;
        let base = window.location.host;
        this.shareUrl = proto + '//' + base + '?searchRequest=' + args;
    }

    getGetParameter()
    {
        var normalizedQueryString = window.location.search;
        if (normalizedQueryString.indexOf('?') == 0) {
            normalizedQueryString = normalizedQueryString.substring(1);
        }
        var params = new URLSearchParams(normalizedQueryString).get('searchRequest');
        return params;
    }

  setSearchFiltersFromUrlParameters() {
      let params = this.getGetParameter();
      if (params == null) {
          this.searchRequest = {
            required: [],
            excluded: [],
            dbname: "",
          }
      } else {
          params = decodeURIComponent(params);
          this.searchRequest = JSON.parse(params);
      }
  }

  ngOnInit() {
    this.searchResult = JSON.parse(this.jsonFromServer);

    this.setSearchFiltersFromUrlParameters();
    this.updateShareUrl();

    this.http.get(this.backendUrl + "/api/LogDatabases")
      .map(x => x.json() || ["REFRESH BROWSER"])
      .subscribe(x => {
        this.databases = x;
        this.searchRequest.dbname = x[0];

        this.doTheSearch();
      });

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

    clearExcluded(idx: number) {
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

    doTheSearch() {
      let args = `filterSpecification=${JSON.stringify(this.searchRequest)}`;
      this.http.get(`${this.backendUrl}/api/LogEntries?${args}`)
        .map(x => x.json() || ["REFRESH BROWSER"])
        .subscribe(x => {
          console.log(x);
          this.searchResult = x;
        });

    }
}
