import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormArray, FormGroup, Validators } from '@angular/forms';
import { RowState, FormUtilService } from '@app/shared';
import { Guid } from 'guid-typescript';
import { LookupDemoComponent } from '../input/lookup-demo/lookup-demo.component';
import { LookupDemoService } from '../input/lookup-demo/lookup-demo.service';

export class User {
  guid: string;
  name?: string;
  startDate?: Date;
  type?: string;
  salary?: number;
  active?: boolean;
  description: string;
  rowState: RowState;
  show: boolean;
  companyCode: string;
  companyName: string;
  form?: FormGroup;
}


@Component({
  selector: 'app-input-datatable',
  templateUrl: './input-datatable.component.html',
  styleUrls: ['./input-datatable.component.scss']
})
export class InputDatatableComponent implements OnInit {
  demoItemSelected = [];
  demoItems = [
    { guid: Guid.raw(), name: 'test1', startDate: new Date(), type: '01', salary: 2000.01, active: true, description: 'testdesc', rowState: RowState.Normal } as User,
    { guid: Guid.raw(), name: 'test2', startDate: new Date(), type: '01', salary: 1000.01, active: true, description: 'testdesc', rowState: RowState.Normal } as User
  ]

  LookupDemoComponent = LookupDemoComponent;
  LookupDemoService = LookupDemoService;

  constructor(private fb: FormBuilder, private util: FormUtilService) { }

  ngOnInit() {
    this.rebuildForm();
  }

  createItemForm(user) {
    const fg = this.fb.group({
      name: [null, Validators.required],
      startDate: null,
      salary: null,
      active: false,
      description: null,
      companyCode: null,
      rowState: RowState.Add,
      assigned: false
    });
    fg.valueChanges.subscribe((control) => {
      if (control.assigned && control.rowState == RowState.Normal) {
        fg.controls.rowState.setValue(RowState.Edit, { emitEvent: false });
      }
      fg.controls.assigned.setValue(true, { emitEvent: false });
    }
    )
    fg.patchValue(user);
    if (user.name) {
      fg.controls.name.disable({ emitEvent: false });
    }
    return fg;
  }

  rebuildForm() {
    this.demoItems.map(detail => detail.form = this.createItemForm(detail))
    console.log(this.demoItems);
  }

  add() {
    const newItem = { guid: Guid.raw() } as User;
    newItem.form = this.createItemForm(newItem);
    this.demoItems.push(newItem);
    this.demoItems = [...this.demoItems];
  }

  remove(guid) {

    this.demoItemSelected = this.demoItemSelected.filter(function (obj) {
      return obj.guid !== guid;
    });

    this.demoItems = this.demoItems.filter(item => item.guid !== guid);
  }

  save() {
    this.demoItems.map(item => this.util.markFormGroupTouched(item.form));
    if (this.demoItems.some(item => item.form.invalid)) {
      return;
    }
    this.demoItems.map(item => Object.assign(item, item.form.getRawValue()));
    console.log(this.demoItems);
  }
}
