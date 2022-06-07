import { Component, OnInit, Input } from '@angular/core';
import { BaseFormField } from '../base-form';
import { Guid } from 'guid-typescript';

@Component({
  selector: 'radio-checkbox',
  templateUrl: './radio-checkbox.component.html',
  styleUrls: ['./radio-checkbox.component.scss']
})
export class RadioCheckboxComponent extends BaseFormField {

  @Input() items = [];
  @Input() inline = true;

  guid = Guid.raw();
  writeValue(obj: any): void {
    this.value = obj;
  }

  ngOnInit() {

  }

  onSelect(item) {
    if (this.value == item.value) {
      this.value = null;
    }
    else {
      this.value = item.value;
    }
    this.onChange(this.value);
  }

}
