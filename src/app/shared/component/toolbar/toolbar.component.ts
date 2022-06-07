import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Location } from '@angular/common';

@Component({
  selector: 'toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss']
})
export class ToolbarComponent implements OnInit { 
  @Input() showBack:boolean=true;
  constructor( private location: Location) { }

  ngOnInit() {
  }

  back() {
    this.location.back();
  }
}
