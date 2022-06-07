import { Component, OnInit } from '@angular/core';
import { Page, RowState, FormUtilService } from '@app/shared';
import { FormGroup, FormBuilder, FormArray } from '@angular/forms';
import { Guid } from "guid-typescript";
import * as Big from "big.js";
import { MessageService } from '@app/core';
export class User {
  guid: string;
  name?: string;
  startDate?: Date;
  type?:string;
  salary?:number;
  active?:boolean;
  RowState:RowState;
  constructor(){
    this.guid = Guid.raw();
    this.name = null;
    this.startDate = null;
    this.type = '01';
    this.salary = null;
    this.active = true;
    this.RowState = RowState.Add;
  }
}

@Component({
  selector: 'app-datatable',
  templateUrl: './datatable.component.html',
  styleUrls: ['./datatable.component.scss']
})
export class DatatableComponent   {

  page = new Page();
  contacts = [
    { name: 'Austin', gender: 'Male', startDate: new Date(), company: 'Swimlane', active: true },
    { name: 'Dany', gender: 'Male',startDate: new Date(), salary: 23000.10, company: 'KFC' },
    { name: 'Molly', gender: 'Female', salary: 30000.00,company: 'Burger King' },
    { name: 'Austin', gender: 'Male', company: 'Swimlane' },
    { name: 'Dany', gender: 'Male', company: 'KFC' },
    { name: 'Molly', gender: 'Female', company: 'Burger King', active: true },
    { name: 'Austin', gender: 'Male', company: 'Swimlane' },
    { name: 'Dany', gender: 'Male', company: 'KFC' },
    { name: 'Molly', gender: 'Female', company: 'Burger King', active: true },
  ];
  constructor() {
    this.page.totalElements = this.contacts.length;
  }

  summary() {
    return this.contacts.map(row => row.salary)
      .reduce((sum,number) => {
        return new Big(number || 0).add(sum).toFixed(2)//sum+(number || 0)
      }, 0);
  }

}
