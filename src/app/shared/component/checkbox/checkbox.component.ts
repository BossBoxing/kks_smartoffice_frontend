import { Component ,Output, EventEmitter } from '@angular/core';
import { BaseFormField } from '../base-form';

@Component({
  selector: 'checkbox',
  templateUrl: './checkbox.component.html',
  styleUrls: ['./checkbox.component.scss']
})
export class CheckboxComponent extends BaseFormField {
  @Output() afterChange = new EventEmitter<boolean>();

  //ControlValueAccessor interface
  writeValue(obj: boolean) { 
    this.value = obj;
  }

  onSelect(value){
     this.onChange(value);
     this.value = value;
  }
}
