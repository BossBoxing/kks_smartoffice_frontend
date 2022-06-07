import { Component, Input, Self, ElementRef, Renderer2, Optional, ViewChild, SimpleChanges, ChangeDetectionStrategy, ChangeDetectorRef, Injector } from '@angular/core';
import { NgControl } from '@angular/forms';
import { BaseFormField } from '../base-form';
import { ModalService, Size } from '../modal/modal.service';
import { BaseLookup } from './base-lookup';
import { finalize, first } from 'rxjs/operators';
import { Subscription, BehaviorSubject } from 'rxjs';

@Component({
  selector: 'lookup',
  templateUrl: './lookup.component.html',
  styleUrls: ['./lookup.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LookupComponent extends BaseFormField {

  @Input() name: string;
  @Input() param: any = {};
  @Input() content: any;
  @Input() service: any;
  @Input() bindValue = 'value';
  @Input() size: Size = Size.medium;
  @Input() disableOnParent: boolean = false;
  searching: boolean = false;
  private descriptions: any[] = [];
  @ViewChild('textBox', { static: true }) textBox: ElementRef;
  private lookupService: BaseLookup;
  private ready: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  private readySub: Subscription;
  private isTable: boolean = false;
  constructor(
    @Optional() @Self() public controlDir: NgControl,
    private renderer: Renderer2,
    private modal: ModalService,
    private cd: ChangeDetectorRef,
    private injector: Injector
  ) { super(controlDir) }

  private getDesctiptionElement(parent: string) {
    this.descriptions = this.element.closest(parent).querySelectorAll(`[lookupParent='${this.name}']`) || [];
  }

  get isDisableOnParent() {
    if (this.disableOnParent && this.param && Object.keys(this.param).length > 0) {
      return !Object.values(this.param).every(value => value !== null && value !== undefined && value !== '');
    }
    else return this.disableOnParent;
  }

  ngOnInit() {
    this.lookupService = this.injector.get(this.service);
    let intable = this.element.closest("datatable-body-cell");
    if (intable) {
      this.isTable = true;
    }
  };

  ngOnDestroy() {
    if (this.readySub) this.readySub.unsubscribe();
  }

  ngAfterViewInit() {
    if (!this.isTable) {
      this.getDesctiptionElement("form");
      this.ready.next(true);
    }
    else if (this.isTable) {
      setTimeout(() => {
        this.getDesctiptionElement("datatable-body-row");
        this.ready.next(true);
      }, 200);

    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.param && changes.param.previousValue !== undefined && changes.param.previousValue != changes.param.currentValue) {
      this.writeValue(null);
      this.onChange(null);
    }
  }

  get element() {
    return this.textBox.nativeElement;
  }

  writeValue(key: any): void {
    this.value = key;
    this.renderer.setProperty(this.element, 'value', this.value);
    this.bindDescription();
    this.cd.markForCheck();
  }

  open() {
    const initialState = {
      keyword: this.element.value,
      parameter: this.param
    };
    this.modal.openComponent(this.content, this.size, initialState).subscribe(result => {
      if (result) {
        this.writeValue(result);
        this.onChange(result);
      }
      else this.clearOnClose();
    })
  }

  onInput(value) {
    if (value) {
      this.searching = true;
      this.lookupService.single(this.param, value).pipe(
        finalize(() => this.searching = false)
      ).subscribe(result => {
        if (result.length === 1) {
          let key = result[0][this.bindValue];
          this.writeValue(key);
          this.onChange(key);
        }
        else {
          this.open();
        }
      })
    }
    else {
      this.writeValue(null);
      this.onChange(null);
    }
  }

  clearOnClose() {
    if (this.value != this.element.value) {
      this.writeValue(null);
      this.onChange(null);
    }
  }

  bindDescription() {
    this.readySub = this.ready.pipe(first(ready => ready)).subscribe(() => {
      if (this.descriptions.length) {
        if (this.value) {
          this.lookupService.description(this.value,this.param).subscribe(result => {
            if (result) this.assignDescription(result);
          })
        }
        else {
          this.assignDescription(null);
        }
      }
    });
  }

  assignDescription(result: any) {
    result = result || {};
    this.descriptions.forEach(desc => {
      switch (desc.tagName) {
        case 'INPUT': {
          this.renderer.setProperty(desc, 'value', result[desc.name] || '');
          break;
        }
        case 'TEXTBOX': {
          let input = (Array.from(desc.children)).find((elements: any) => elements.tagName == 'INPUT');
          this.renderer.setProperty(input, 'value', result[desc.attributes['name'].value] || '');
          break;
        }
        default: {
          this.renderer.setProperty(desc, 'innerHTML', result[desc.attributes['name'].value] || '');
          break;
        }
      }
    })
  }
}
