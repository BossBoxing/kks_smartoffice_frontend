import { Component, OnInit } from '@angular/core';
import { BaseLookupMultipleComponent, FormUtilService, Page } from '@app/shared';
import { BsModalRef } from 'ngx-bootstrap';
import { Surt04Service } from '../surt04.service';

@Component({
  selector: 'app-surt04-menu-lookup',
  templateUrl: './surt04-menu-lookup.component.html'
})
export class Surt04MenuLookupComponent extends BaseLookupMultipleComponent implements OnInit {
  keyword = '';
  page = new Page();

  constructor(
    private su: Surt04Service,
    public util: FormUtilService,
    private modal: BsModalRef
  ) { super(modal); }

  ngOnInit() {
    this.search();
  }

  search() {
    this.su.findMenuForLookup(this.keyword, this.page).subscribe(res => {
      this.queryResult(res);
    });
  }

  enter(value) {
    this.keyword = value;
    this.page.index = 0;
    this.search();
  }

  identity(row) {
    const key = { menuId: row.menuId };
    return JSON.stringify(key);
  }
}
