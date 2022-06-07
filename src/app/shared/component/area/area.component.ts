import { Component, OnInit, Input } from '@angular/core';
import { BaseFormField } from '../base-form';

@Component({
  selector: 'areabox',
  templateUrl: './area.component.html',
  styleUrls: ['./area.component.scss']
})
export class AreaComponent extends BaseFormField {
  @Input() rows = 4;
  writeValue(obj: any): void {
    this.value = obj;
  }
}
