import {
  Component, Input, ViewChild, ContentChildren, QueryList, ContentChild,
  ViewEncapsulation, SimpleChanges, ElementRef, Output, EventEmitter
} from '@angular/core';
import {
  DatatableComponent, DataTableColumnDirective, DatatableRowDetailDirective,
  ColumnMode, DatatableMergeHeaderDirective, SortType
} from 'ss-group-datatable';
import { Page } from '../page.model';

@Component({
  selector: 'app-table-group',
  templateUrl: './table-group.component.html',
  styleUrls: ['../table.scss'],
})
export class TableGroupComponent {
  @ViewChild('myTable') table: any;
  @Input() rows: any[];
  @Input() select: any[] = [];
  @Input() sorts: any;
  @Input() groupRow: any;
  @Input() groupHead: boolean = false;
  @Input() disableButton: boolean = false;
  @Input() pagination: boolean = true;
  @Input() rowIdentity: (x: any) => any = ((x: any) => x);
  @Input() trackByProp: string = "guid";
  @Input() summaryRow: boolean = false;
  @Input() page: Page;
  @Output() createRow = new EventEmitter<any>();
  pageSizes = Array.from(Array(20).keys()).map((v, i) => 10 + i * 10);
  rowHead: number;
  expanded: any = {};
  messages = {
    emptyMessage: `
      <div class="text-center text-secondary">
        <span>ไม่พบข้อมูล</span>
      </div>
    `
  }
  columnMode = ColumnMode;
  SortType = SortType;

  @ViewChild(DatatableComponent, { static: true }) datatable: DatatableComponent;
  @ContentChildren(DatatableMergeHeaderDirective) mergeHeaders: QueryList<DatatableMergeHeaderDirective>;
  @ContentChildren(DataTableColumnDirective) columns: QueryList<DataTableColumnDirective>;
  @ContentChild(DatatableRowDetailDirective, { static: false }) rowDetail: DatatableRowDetailDirective;

  toggleExpandGroup(group) {
    console.log('Toggled Expand Group!', group);
    this.table.groupHeader.toggleExpandGroup(group);
  }

  addRowButton(id) {
    console.log('onAddRow TableGroupComponent');
    this.createRow.emit(id);
  }

  ngOnInit() {
    if (!this.pagination) this.page = { index: 0 } as Page;
    else if (!this.page) this.page = new Page();
    this.rowHead = 0;
    this.rows.forEach(element => {
      if(element.header=== true){
        this.rowHead += 1;
      }
    });

    const hasSize = this.pageSizes.find(value => value === Number(this.page.size));
    if (!hasSize && Number(this.page.size) % 10 !== 0) {
      this.pageSizes.push(Number(this.page.size));
      this.pageSizes.sort((a, b) => a - b );
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.page) {
      this.onPage({ offset: this.page.index });
    }
  }
  ngAfterContentInit() {
    this.datatable.mergeHeaders = this.mergeHeaders;
    this.datatable.rowDetail = this.rowDetail;
    this.datatable.columnTemplates = this.columns;
  }

  onPageSize(value) {
    this.page.index = 0;
    this.page.size = Number(value);
  }

  onPage(event, focus?: boolean): void {
    this.page.index = event.offset;
    this.datatable.offset = this.page.index;
  }

  goLastPage() {
    const count = this.rows.length;
    let goOffset = (count) / this.page.size;
    this.onPage({ offset: Math.floor(goOffset) || 0 });
    if (this.datatable.rowDetail) {
      setTimeout(() => {
        this.toggleExpandRow(this.rows[count - 1]);
      }, 100);
    }
  }

  onSelect({ selected }) {
    if (selected) {
      this.select.splice(0, this.select.length);
      this.select.push(...selected);
    }
  }

  toggleExpandRow(row) {
    this.datatable.rowDetail.toggleExpandRow(row);
  }

  expandAllRows() {
    setTimeout(() => {
      this.datatable.rowDetail.expandAllRows();

    }, 100);
  }

  collapseAllRows() {
    this.datatable.rowDetail.collapseAllRows();
  }

}
