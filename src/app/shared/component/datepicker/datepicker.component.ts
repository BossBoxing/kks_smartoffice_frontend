import { Component, ElementRef, ViewChild, Input, SimpleChanges } from '@angular/core';
import { Subscription, BehaviorSubject } from 'rxjs';
import { MatDatepickerInput } from '@angular/material/datepicker';
import { BaseFormField } from '../base-form';
import IMask from 'imask';
import { first } from 'rxjs/operators';

@Component({
  selector: 'datepicker',
  templateUrl: './datepicker.component.html',
  styleUrls: ['./datepicker.component.scss']
})
export class DatepickerComponent extends BaseFormField {
  private defaultMin = new Date(1754, 0, 1);
  private defaultMax = new Date(9999, 11, 31);
  @Input() min: Date = this.defaultMin;
  @Input() max: Date = this.defaultMax;
  @Input() startValueItem = null;

  imask = {
    mask: Date,  // enable date mask
    min: this.defaultMin,  // defaults to `1900-01-01`
    max: this.defaultMax,  // defaults to `9999-01-01`
    // other options are optional
    pattern: 'd/`m/`Y',  // Pattern mask with defined blocks, default is 'd{.}`m{.}`Y'
    // you can provide your own blocks definitions, default blocks for date mask are:
    blocks: {
      d: {
        mask: IMask.MaskedRange,
        from: 1,
        to: 31,
        maxLength: 2,
      },
      m: {
        mask: IMask.MaskedRange,
        from: 1,
        to: 12,
        maxLength: 2,
      },
      Y: {
        mask: IMask.MaskedRange,
        from: 2297,
        to: 9999,
      }
    },
    // define date -> str convertion
    format: function (date) {
      var day = date.getDate();
      var month = date.getMonth() + 1;
      var year = date.getFullYear() + 543;
      if (day < 10) day = "0" + day;
      if (month < 10) month = "0" + month;
      return [day, month, year].join('/');
    },
    // define str -> date convertion
    parse: function (str) {
      var yearMonthDay = str.split('/');
      return new Date(yearMonthDay[2] - 543, yearMonthDay[1] - 1, yearMonthDay[0]);
    },
    autofix: false,
    lazy: false,
  };
  private _writing: boolean = false;
  private _writingValue: any;
  maskRef?: IMask.InputMask<IMask.AnyMaskedOptions>;
  eventSubscription: Subscription;
  @ViewChild('inputDate', { static: true }) inputDate: ElementRef;
  @ViewChild(MatDatepickerInput, { static: true }) datepickerInput: MatDatepickerInput<any>;
  private ready: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  readySub: Subscription;
  readyMinSub:Subscription;
  readyMaxSub:Subscription;
  ngAfterViewInit() {
    this.initMask();
    if (this.startValueItem && this.startValueItem.valueChanges) {
      this.startValueItem.valueChanges.subscribe(value => {
        if (value && this.maskValue && value > this.maskValue) { // if Start > End then override End to Start
          this.writeValue(value);
        }
      });
    }
    this.ready.next(true);
    if (this.value) {
      this._assignValue(this.value);
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.min) {
      let minDate: Date = null;
      if (changes.min.currentValue) {
        minDate = changes.min.currentValue instanceof Date ? changes.min.currentValue : new Date(changes.min.currentValue);
      }
      else {
        minDate = this.defaultMin;
      }
      minDate.setHours(0,0,0,0);
      this.imask.min = minDate;
      if (this.maskRef) this.maskRef.updateOptions(this.imask);
    }
    else if (changes.max) {
      let maxDate: Date = null;
      if (changes.max.currentValue) {
        maxDate = changes.max.currentValue instanceof Date ? changes.max.currentValue : new Date(changes.max.currentValue);
      }
      else {
        maxDate = this.defaultMax;
      }
      maxDate.setHours(0,0,0,0);
      this.imask.max = maxDate;
      if (this.maskRef) this.maskRef.updateOptions(this.imask);
    }
    else if(changes.value){
      if (changes.value) {
        this._assignValue(changes.value.currentValue);
      }
    }
  }

  _assignValue(value) {
    value = value ? new Date(value) : null;
    if(value) value.setHours(0,0,0,0);
    if (this.maskRef) {
      this.beginWrite(value);
      this.maskValue = value;
      this.datepickerInput._onInput(this.maskRef.value);
    }
  }

  writeValue(value: any) {
    this.readySub = this.ready.pipe(first(ready => ready)).subscribe(() => {
      this._assignValue(value);
    })
  }

  destroyMask() {
    if (this.maskRef) {
      this.maskRef.destroy();
      delete this.maskRef;
    }
  }

  ngOnDestroy() {
    this.destroyMask();
    if (this.readySub) this.readySub.unsubscribe();
  }

  private initMask() {
    this.maskRef = IMask(this.element, this.imask)
      .on('accept', this._onAccept.bind(this))
  }

  get element() {
    return this.inputDate.nativeElement;
  }
  get maskValue(): any {
    return this.maskRef.typedValue;
  }

  set maskValue(value: any) {
    if (value) this.maskRef.typedValue = value;
    else this.maskRef.unmaskedValue = '';
  }

  beginWrite(value: any): void {
    this._writing = true;
    this._writingValue = value;
  }

  endWrite(): any {
    this._writing = false;
    return this._writingValue;
  }

  _onblur() {

    const value = this.maskValue;
    if (value == null) {
      this.beginWrite(null);
      this.maskRef.unmaskedValue = '';
    }
    this.onTouched();
  }

  _onAccept() {
    const value = this.maskValue;
    if (this._writing && this._equal(value, this.endWrite())) return;
    this.onChange(value);
    this.datepickerInput._onInput(this.maskRef.value);
  }

  _equal(first: Date, second: Date) {
    if ((first && !second) || !first && second) return false;
    else if (!first && !second) return true;
    else if (first.valueOf() == second.valueOf()) return true;
  }

  pickerChange(value) {
    this.maskValue = value;
  }
}
