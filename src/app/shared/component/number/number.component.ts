import { Component, ViewChild, ElementRef, SimpleChanges, Input } from '@angular/core';
import IMask from 'imask';
import { BaseFormField } from '../base-form';
import { Subject, Subscription, BehaviorSubject } from 'rxjs';
import * as Big from 'big.js';
import { first } from 'rxjs/operators';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'number:not([currency])',
  templateUrl: './number.component.html',
  styleUrls: ['./number.component.scss']
})
export class NumberComponent extends BaseFormField {
  @Input() separator:boolean = true;
  imask =  {
    mask: Number,  // enable number mask
    // other options are optional with defaults below
    scale: 0,  // digits after point, 0 for integers
    signed: true,  // disallow negative
    thousandsSeparator: ',',  // any single char
    padFractionalZeros: false,  // if true, then pads zeros at end to the length of scale
    normalizeZeros: true,  // appends or removes zeros at ends
    radix: '.',  // fractional delimiter
    mapToRadix: ['.'],  // symbols to process as radix
    min: -99999999999999,
    max: 999999999999999
  };
  maskRef?: IMask.InputMask<IMask.AnyMaskedOptions>;

  @ViewChild('textBox', { static: true }) textBox: ElementRef;
  private _writing: boolean = false;
  private _writingValue: any;
  private ready: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  readySub:Subscription;
  
  private initMask() {
    this.imask.thousandsSeparator = this.separator ? ',' : '';
    this.maskRef = IMask(this.element, this.imask)
      .on('accept', this._onAccept.bind(this))
  } 
  get element() {
    return this.textBox.nativeElement;
  }

  ngOnInit() {
    if (this.control) {
      const validatorMin = this.control.validator && this.control.validator(new FormControl(-1))
      const hasMin = Boolean(validatorMin && validatorMin.hasOwnProperty('min'));
      if(hasMin){
        this.imask.signed = false;
        this.imask.min = 0;
      }
    }
  }

  ngOnChanges(changes: SimpleChanges): void{
    if(changes.value){
      this._assignValue(changes.value.currentValue);
    }
  }
  
  ngAfterViewInit() {
    this.initMask();
    this.ready.next(true);
    if(this.value){
      this._assignValue(this.value);
    }
  }
 
  destroyMask() {
    if (this.maskRef) {
      this.maskRef.destroy();
      delete this.maskRef;
    }
  }

  ngOnDestroy() {
    this.destroyMask();
    if(this.readySub) this.readySub.unsubscribe();
  }

  _assignValue(value){
    value = value != null && value != undefined ? Number(new Big(value).toFixed(0)) : null;
    if (this.maskRef) {
      this.beginWrite(value);
      this.maskValue = value;
    }
  }

  writeValue(value: any): void {
    this.readySub = this.ready.pipe(first(ready => ready)).subscribe(() => {
     this._assignValue(value);
    })
  }

  get maskValue(): any {
    return this.maskRef.value ? this.maskRef.typedValue : null;
  }

  set maskValue(value: any) {
    this.maskRef.typedValue = value;
  }

  beginWrite (value: any): void {
    this._writing = true;
    this._writingValue = value;
  }

  endWrite (): any {
    this._writing = false;
    return this._writingValue;
  }

  _onAccept() {
    const value = this.maskValue;
    if (this._writing && value === this.endWrite()) return;
    this.onChange(value);
  }
}
