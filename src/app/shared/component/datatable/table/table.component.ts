import { Component, Input, Output, EventEmitter, ViewChild, QueryList, ContentChildren, ContentChild} from '@angular/core';
import { ColumnMode, DatatableComponent, DataTableColumnDirective, DatatableMergeHeaderDirective, DatatableRowDetailDirective } from 'ss-group-datatable';
import { Page } from '../page.model';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['../table.scss']
})
export class TableComponent {
  ColumnMode = ColumnMode;
  @Input() rows: any[];
  @Input() page = new Page();
  @Input() select: any[] = [];
  @Input() selectOnePage: boolean = false;
  @Output() onTableEvent = new EventEmitter();
  @Input() rowIdentity: (x: any) => any = ((x: any) => x);
  @Input() trackByProp: string = "guid";
  @Input() summaryRow: boolean = false;
  @Input() sort: any[] = [];
  @Input() rowClass: any;
  hasGroupHeader:boolean = false;
  pageSizes = Array.from(Array(20).keys()).map((v, i) => 10 + i * 10);
  messages = {
    emptyMessage: `
      <div class="text-center text-secondary">
        <span>ไม่พบข้อมูล</span>
      </div>
    `
  }
  columnMode = ColumnMode;

  @ViewChild(DatatableComponent, { static: true }) datatable: DatatableComponent;
  @ContentChildren(DatatableMergeHeaderDirective) mergeHeaders : QueryList<DatatableMergeHeaderDirective>;
  @ContentChildren(DataTableColumnDirective) columns: QueryList<DataTableColumnDirective>;
  @ContentChild(DatatableRowDetailDirective, { static: false}) rowDetail: DatatableRowDetailDirective;

  ngAfterContentInit() {
    this.datatable.mergeHeaders = this.mergeHeaders;
    this.datatable.columnTemplates = this.columns;
    this.datatable.rowDetail = this.rowDetail;
    if (this.sort != null && this.sort.length === 0) {
      this.sort = this.getSortProperty();
    }

    const hasSize = this.pageSizes.find(value => value === Number(this.page.size));
    if (!hasSize && Number(this.page.size) % 10 !== 0) {
      this.pageSizes.push(Number(this.page.size));
      this.pageSizes.sort((a, b) => a - b );
    }
  }

  ngOnDestroy() {
    this.onTableEvent.complete();
  }
  onSort(event): void {
    this.datatable.offset = this.page.index;
    let prop: string = event.sorts[0].prop;
    this.page.sort = prop + " " + event.sorts[0].dir;
    this.onTableEvent.emit();
  }

  onPage(event): void {
    this.page.index = event.offset;
    this.onTableEvent.emit();
  }

  onPageSize(value) {
    this.page.index = 0;
    this.page.size = Number(value);
    this.onTableEvent.emit();
  }
  onChecked({ selected }) {
    this.select.splice(0, this.select.length);
    this.select.push(...selected);
  }

  toggleExpandRow(row) {
    this.datatable.rowDetail.toggleExpandRow(row);
  }

  expandAllRows(){
    setTimeout(() => {
    this.datatable.rowDetail.expandAllRows();

    }, 100);
  }

  collapseAllRows(){
    this.datatable.rowDetail.collapseAllRows();
  }

  getSortProperty() {
    if (this.page == null || this.page.sort == null || this.page.sort === '') {
        return [];
    } else {
        return [{ prop: this.page.sort.split(' ')[0] ,  dir: this.page.sort.split(' ')[1] }];
    }
  }

  getRowClass = (row) => {
    if (typeof this.rowClass === 'function') {
      this.datatable.rowClass = this.rowClass;
    } else {
      return this.rowClass;
    }
  }
}
