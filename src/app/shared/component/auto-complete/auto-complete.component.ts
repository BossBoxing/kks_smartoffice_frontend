import { Component, Input, TemplateRef, ContentChild } from '@angular/core';
import { BaseFormField } from '../base-form';
import { Subject, Observable, concat, of, BehaviorSubject, Subscription, merge } from 'rxjs';
import { debounceTime, distinctUntilChanged, tap, switchMap, catchError, first, filter } from 'rxjs/operators';

@Component({
  selector: 'auto-complete',
  templateUrl: './auto-complete.component.html',
  styleUrls: ['./auto-complete.component.scss']
})
export class AutoCompleteComponent extends BaseFormField {

  @Input() bindLabel = "text";
  @Input() bindValue = "value";
  @Input() bindDesc = "description";
  @Input() modelChange: Subject<any>;
  @Input() showDescription = false;
  @Input() customLabel = false;
  @Input() customTemplate = false;
  @Input() onSearch: (term: any, value?: any) => Observable<any[]>;
  @Input() labelTemplate: TemplateRef<any>;
  @Input() optionTemplate: TemplateRef<any>;
  @Input() startValueItem = null;

  items: Observable<any[]>;
  appendTo: string;
  loading = false;
  typeAhead = new Subject<string>();
  openState = new Subject();

  private loadedItems: any = {} as any;
  private ready = new BehaviorSubject<boolean>(false);
  private readySub: Subscription;

  @ContentChild(TemplateRef) defaultTemplate: TemplateRef<any>;
  ngOnInit() {
    this.appendTo = this.small ? 'Body' : null
    this.placeholder = this.placeholder ? this.placeholder : 'label.ALL.PleaseSelectAuto'
    if (this.customTemplate && this.optionTemplate == null) {
      this.optionTemplate = this.defaultTemplate;
    }
    if (this.startValueItem && this.startValueItem.valueChanges) {
      this.startValueItem.valueChanges.subscribe(value => {
        if (value && this.value && value > this.value) { // if Start > End then override End to Start
          this.writeValue(value);
        }
      });
    }
    this.ready.next(true);
  }

  ngOnDestroy() {
    if (this.readySub) this.readySub.unsubscribe();
  }

  writeValue(value: any): void {
    this.value = value;
    this.clearItems();
    this.readySub = this.ready.pipe(first(ready => ready)).subscribe(() => {
      this.loadData();
    });
  }

  trackByFn(item: any) {
    return item[this.bindValue];
  }

  onSelected(event) {
    this.onChange(event);
    this.value = event;
    this.clearItems();
  }

  onItemChange(model) {
    if (this.modelChange) {
      this.modelChange.next(model || {});
    }
  }

  onOpen() {
    this.openState.next();
  }

  private loadData() {
    this.loading = true;
    this.items = concat(
      this.onSearch(null, this.value).pipe(
        tap(items => { 
          if (this.modelChange) this.modelChange.next(this.value ? items[0] : {})
          this.loading = false
        })
      ),
      merge(
        this.openState.pipe(
          tap(() => this.loading = true),
          switchMap(() => this.getItems().pipe(
            catchError(() => of([])), // empty list on error
            tap(() => this.loading = false)
          ))
        ),
        this.typeAhead.pipe(
          debounceTime(300),
          //filter(term=>term && term.length > 2),
          distinctUntilChanged(),
          tap(() => this.loading = true),
          switchMap(term => {
              return this.onSearch(term).pipe(
              catchError(() => of([])), // empty list on error
              tap(() => this.loading = false))
            }
          )
        )
      )
    );
  }

  private getItems() {
    if (this.loadedItems.length > 0) {
      return of(this.loadedItems);
    }
    else {
      return this.onSearch(null).pipe(
        tap(items => this.loadedItems = items)
      )
    }
  }

  private clearItems() {
    if (this.loadedItems.length) {
      let current = this.loadedItems.find(item => item[this.bindValue] === this.value);
      if (!current) this.loadedItems = [];
    }
  }
}
