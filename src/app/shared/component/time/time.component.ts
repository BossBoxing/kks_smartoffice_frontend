import { Component, OnInit, ViewChild, ElementRef, SimpleChanges } from '@angular/core';
import IMask from 'imask';

import { BaseFormField } from '../base-form';
import { BehaviorSubject, Subscription } from 'rxjs';
import { first } from 'rxjs/operators';


@Component({
  selector: 'time',
  templateUrl: './time.component.html',
  styleUrls: ['./time.component.scss']
})
export class TimeComponent extends BaseFormField{
  imask =  {
    mask: 'HH{:}MM',
    lazy: false,
    blocks: {
      HH: {
        mask: IMask.MaskedRange,
        from: 0,
        to: 23
      },
      MM: {
        mask: IMask.MaskedRange,
        from: 0,
        to: 59
      }
    }
  };
  maskRef?: IMask.InputMask<IMask.AnyMaskedOptions>;

  @ViewChild('time', { static: true }) time: ElementRef;
  private _writing: boolean = false;
  private _writingValue: any;
  ready: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  readySub:Subscription;
  
  private initMask() {
    this.maskRef = IMask(this.element, this.imask)
      .on('accept', this._onAccept.bind(this))
  } 
  get element() {
    return this.time.nativeElement;
  }

  ngAfterViewInit() {
    this.initMask();
    this.ready.next(true);
    if(this.value){
      this._assignValue(this.value);
    }
  }
 
  _getTime(time:string):string[]{
      return time.split(':');
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.value) {
      this._assignValue(changes.value.currentValue);
    }
    // if (this.maskRef){
    //    if(changes.min){
    //      this.imask.blocks.HH.from = Number(this._getTime(changes.min.currentValue)[0]);
    //      this.imask.blocks.MM.from = Number()
    //      this.maskRef.updateOptions(this.imask);
    //    }
    //    if(changes.max){
        
    //     this.maskRef.updateOptions(this.imask);
    //    }
    // }
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
    value = (value || '').toString();
    const timeRegex = /[0-9]{1,2}:[0-9]{1,2}/;
    const match = value.match(timeRegex);
    if(match) value = match[0];
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
    return this.maskRef.unmaskedValue ? this.maskRef.unmaskedValue : null;
  }

  set maskValue(value: any) {
     this.maskRef.unmaskedValue = value;
  }

  
  beginWrite (value: any): void {
    this._writing = true;
    this._writingValue = value;
  }

  endWrite (): any {
    this._writing = false;
    return this._writingValue;
  }
  _onblur(){
    if(!this.maskRef.masked.isComplete){
      this.beginWrite(':');
      this.maskRef.unmaskedValue = ':';
    }
    this.onTouched();
  }
  _onAccept() {
    const value = this.maskValue;
    if (this._writing && value === this.endWrite()) return;
    if(this.maskRef.masked.isComplete){
      this.onChange(value)
    }
    else{
      this.onChange(null)
    }
  }
}
