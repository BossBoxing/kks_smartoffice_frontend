import { Component, OnInit, Input } from '@angular/core';
import { BaseFormField } from '../base-form';

@Component({
  selector: 'check-button',
  templateUrl: './check-button.component.html',
  styleUrls: ['./check-button.component.scss']
})
export class CheckButtonComponent extends BaseFormField {

  @Input() text:string = '';
  @Input() color:string;
  btnActiveClass = 'btn-';
  btnClass = 'btn-outline-';
  
  ngOnInit(){
     this.color = (this.color || 'main').toLocaleLowerCase();
     this.btnClass = this.btnClass+this.color;
     this.btnActiveClass = this.btnActiveClass+this.color;
  }

  writeValue(obj: boolean) { 
    this.value = obj;
  }
  onSelect(){
    this.value = !this.value;
    this.onChange(this.value);
  }
}
