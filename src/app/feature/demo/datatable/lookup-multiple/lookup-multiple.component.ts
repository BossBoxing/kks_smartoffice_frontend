import { Component } from '@angular/core';
 
import { BsModalRef } from 'ngx-bootstrap';
import { Page, BaseLookupMultipleComponent } from '@app/shared';
import { LookupMultipleService } from './lookup-multiple.service';
 
@Component({
  selector: 'app-lookup-multiple',
  templateUrl: './lookup-multiple.component.html',
  styleUrls: ['./lookup-multiple.component.scss']
})
export class LookupMultipleComponent  extends BaseLookupMultipleComponent {
  
  items=[];
  page = new Page();
  constructor(private ls:LookupMultipleService,private modal:BsModalRef) { super(modal) }

  ngOnInit() {
    this.search();
  }
  
  enter(event){
    this.keyword = event;
    this.page.index = 0;
    this.search();
  }
  search(){
    this.ls.getCategories(this.keyword,this.page).subscribe(res=>{
      this.items = res.rows;
      this.page.totalElements = res.count;
    })
  }

  identity(row){
    return row.categoryCode;
  }
}
