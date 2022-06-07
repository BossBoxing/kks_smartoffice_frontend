import { Component, Input } from '@angular/core';
import { BaseFormField } from '../base-form';

@Component({
  selector: 'radio-button',
  templateUrl: './radio-button.component.html'
})
export class RadioButtonComponent extends BaseFormField  {

  @Input() items = [];
  @Input() inline = true;
  
  btnActiveClass = 'btn-';
  btnClass = 'btn-outline-';
  
  ngOnInit(){
     this.items.forEach(item=>{
      item.color = (item.color || 'main').toLocaleLowerCase();
      item.btnClass = item.color == 'monday' ? 'btn-outline-dark-'+item.color : this.btnClass+item.color;
      item.btnActiveClass =  this.btnActiveClass+item.color;
     })
  }

  writeValue(obj: any): void {
    this.value = obj;
  }

  onSelect(value){
    this.onTouched();
    if(this.value != value){
      this.onChange(value);
      this.value = value;
    }
  }
}
