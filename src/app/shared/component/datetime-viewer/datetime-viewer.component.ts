import { Input, OnInit, Optional, Self } from '@angular/core';
import { EventEmitter } from '@angular/core';
import { ElementRef } from '@angular/core';
import { Output } from '@angular/core';
import { Component, ViewChild} from '@angular/core';
import { NgControl } from '@angular/forms';
import { ThaiDatePipe } from '@app/shared/pipe/thaidate.pipe';
import { ThaiDateTimePipe } from '@app/shared/pipe/thaidateTime.pipe';
import { BaseFormField } from '../base-form';

@Component({
  selector: 'datetime-viewer',
  templateUrl: './datetime-viewer.component.html',
  styleUrls: ['./datetime-viewer.component.scss']
})
export class DateTimeViewerComponent extends BaseFormField implements OnInit {

  @ViewChild('inputText', { static: true }) inputText: ElementRef;
  @Input() showTime = true;
  @Input() class = 'text-center';
  @Output() enter = new EventEmitter<any>();

  constructor(
    @Optional() @Self() public controlDir: NgControl,
    private date: ThaiDatePipe,
    private time: ThaiDateTimePipe) {
    super(controlDir);
  }

  ngOnInit() {
    this.value = this.value || '';
  }

  writeValue(value: any): void {
    if (value && (value instanceof Date || new Date(value).toString() !== 'Invalid Date')) {
      if (this.showTime) {
        this.value = this.time.transform(value.toString());
      } else {
        this.value = this.date.transform(value.toString(), null);
      }
    } else {
      this.value = value;
    }
  }

  onTextChange(value){
    this.onChange(value);
    this.value = value;
  }

  get element() {
    return this.inputText.nativeElement;
  }

  onEnter(value){
    this.enter.emit(value);
  }
}
