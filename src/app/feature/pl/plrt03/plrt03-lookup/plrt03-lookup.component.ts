import { Component, OnInit } from '@angular/core';
import { BaseLookupMultipleComponent, FormUtilService, Page } from '@app/shared';
import { BsModalRef } from 'ngx-bootstrap';
import { Plrt03Service } from '../plrt03.service';

@Component({
  selector: 'app-plrt03-lookup',
  templateUrl: './plrt03-lookup.component.html',
  styleUrls: ['./plrt03-lookup.component.scss']
})
export class Plrt03LookupComponent extends BaseLookupMultipleComponent implements OnInit {
  public static readonly programCode = 'plrt03';
  plHolidays = [];
  page = new Page();
  ouCode: string;

  constructor(
    private pl: Plrt03Service,
    public util: FormUtilService,
    private modal: BsModalRef
  ) { super(modal); }

  ngOnInit(): void {
    this.page.index = 0;
    this.search();
  }

  search() {
    this.pl.findPlHolidayLookup(this.page)
      .subscribe(res => {
        this.plHolidays = res.rows;
        this.page.totalElements = res.count;
      });
  }

  identity(row) {
    return row.categoryCode;
  }

}
