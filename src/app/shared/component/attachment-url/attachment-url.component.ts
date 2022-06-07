import { Component } from '@angular/core';
import { BaseFormField } from '../base-form';
export enum HTTP { http = 'http://', https = 'https://' }

@Component({
  selector: 'attachment-url',
  templateUrl: './attachment-url.component.html',
  styleUrls: ['./attachment-url.component.scss']
})
export class AttachmentUrlComponent extends BaseFormField {

  ngOnInit(){
    this.value = this.value || '';
  }

  writeValue(value: any): void {
    this.value = value
  }

  openUrl() {
    if (this.control.value) {
      let http = this.control.value.substring(0, 7);
      let https = this.control.value.substring(0, 8);
      if (http === HTTP.http || https === HTTP.https) {
        window.open(this.control.value, '_blank');
      } else { 
        window.open(`${HTTP.https}${this.control.value}`, '_blank');
      }
    }
  }

  onTextChange(value) {
    this.onChange(value);
    if (this.required) {
      const notEmpty = new RegExp(/\S+/);
      if (notEmpty.test(value)) {
        this.control.setErrors({ empty: null }, { emitEvent: false });
        this.control.updateValueAndValidity({ onlySelf: false, emitEvent: false });
      }
      else {
        this.control.setErrors({ empty: true }, { emitEvent: false });
      }
    }
    this.value = value;
  }

}
