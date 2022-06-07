import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {
 
  @Input() value:any = '';
  @Input() placeholder = '';
  @Input() icon = 'fas fa-search';
  @Output() search = new EventEmitter<any>();
  constructor() { }

  ngOnInit() {
  }

  onEnter(value){
    this.search.emit(value);
  }
}
