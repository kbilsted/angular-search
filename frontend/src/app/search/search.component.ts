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
[
    {
      "name":"Barry",
      "surname":"White"
    },
    {
      "name":"Peter",
      "surname":"Meyer"
    }
]`);
  }

}
