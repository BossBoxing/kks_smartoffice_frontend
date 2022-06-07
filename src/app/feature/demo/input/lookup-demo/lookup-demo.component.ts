import { Component } from '@angular/core';
import { Page, BaseLookupComponent } from '@app/shared';
 
import { LookupDemoService } from './lookup-demo.service';
import { BsModalRef } from 'ngx-bootstrap';

@Component({
  selector: 'app-lookup-demo',
  templateUrl: './lookup-demo.component.html',
  styleUrls: ['./lookup-demo.component.scss']
})
export class LookupDemoComponent extends BaseLookupComponent {
  items = [];
  page = new Page();

  constructor(private ds:LookupDemoService,public modal:BsModalRef){
    super(modal);
  }

  ngOnInit() {
    this.search();
  }

  enter(value){
    this.page.index = 0;
    this.keyword = value;
    this.search();
  }
  search() {
    this.items = this.ds.getItems(this.keyword);
    this.page.totalElements = this.items.length;
  }
}
