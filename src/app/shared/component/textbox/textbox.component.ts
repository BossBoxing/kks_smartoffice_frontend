import { Input } from '@angular/core';
import { EventEmitter } from '@angular/core';
import { OnInit } from '@angular/core';
import { ElementRef } from '@angular/core';
import { Output } from '@angular/core';
import { Component, ViewChild} from '@angular/core';
import { BaseFormField } from '../base-form';

@Component({
  selector: 'textbox',
  templateUrl: './textbox.component.html',
  styleUrls: ['./textbox.component.scss']
})
export class TextboxComponent extends BaseFormField implements OnInit {

  @ViewChild('inputText', { static: true }) inputText: ElementRef;
  @Input() inputType = 'text';
  @Output() enter = new EventEmitter<any>();
  @Input() uppercase = false;

  ngOnInit() {
    this.value = this.value || '';
  }

  writeValue(value: any): void {
    this.value = value;
  }

  onTextChange(value) {
    this.onChange(value);
    if (this.required) {
      const notEmpty = new RegExp(/\S+/);
      if (notEmpty.test(value)) {
        this.control.setErrors({ empty: null}, { emitEvent: false });
        this.control.updateValueAndValidity({ onlySelf: false, emitEvent: false });
      } else {
        this.control.setErrors({ empty: true}, { emitEvent: false });
      }
    }
    this.value = this.uppercase ? value.toUpperCase() : value;
  }

  get element() {
    return this.inputText.nativeElement;
  }

  get type() {
    return this.element.getAttribute('type');
  }

  togglePassword() {
    if (this.type === 'text') {
      this.element.setAttribute('type', 'password');
    } else {
      this.element.setAttribute('type', 'text');
    }
  }

  onEnter(value) {
    this.enter.emit(value);
  }
}
