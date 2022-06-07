
import { Output, EventEmitter, Component } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap';
import { RowState } from '../datatable/state.enum';
import { Guid } from 'guid-typescript';
import { SubscriptionDisposer } from '../subscription-disposer';
import { Page } from '../datatable/page.model';
import { Observable } from 'rxjs';

export interface LookupMultipleResult {
    selected: any[],
    deleting: any[]
}

export interface HasIdentity {
    identity(row: any): any;
}

@Component({
    selector: 'app-base-lookup-multiple',
    template: 'no template'
})
export class BaseLookupMultipleComponent extends SubscriptionDisposer implements HasIdentity {

    keyword: string = '';
    parameter: any = {};
    queryList: any[] = [];
    selectedList: any[] = [];
    deleteList: any[] = [];
    alreadySelected = [];
    isFirst: boolean = true;
    page = new Page();
    @Output() selected = new EventEmitter<LookupMultipleResult>();
    constructor(
        public bsModalRef: BsModalRef
    ) {
        super()

    }

    onAccept(): void {
        this.prepareSelect();
        this.selected.next({ selected: this.selectedList, deleting: this.deleteList } as LookupMultipleResult);
        this.bsModalRef.hide();
    }

    onClose(): void {
        this.selected.next(null);
        this.bsModalRef.hide();
    }

    identity(row: any) {
        throw new Error("Please add identity function.");
    }

    headDisabled(rows:any[]){
        return !rows.some(row=>!row.disabled)
    }

    rowEnable(row){
        return !row.disabled;
    }

    excludeRows(rows: any[]) {
        if (this.isFirst) {
            this.alreadySelected = [...this.selectedList];
            this.selectedList = [];
            this.isFirst = false;
        }
        rows.forEach(row => {
            if (this.alreadySelected.some(select => this.identity(select) === this.identity(row))) {
                row.disabled = true;
            } else {
                row.disabled = false;
                row.rowState = RowState.Add;
                row.guid = Guid.raw();
            }

        })
        return rows;
    }

    markSelected(rows: any[]) {
        if (rows) {
            rows.forEach(row => {
                if (this.selectedList.some(select => this.identity(select) === this.identity(row))) {
                    row.isChecked = true;
                } else {
                    row.isChecked = false;
                }
            });
        }
    }

    checkMissingIntitalSelectedList(queryRows: any[]): boolean {
        let missing = false;
        if (this.selectedList && this.selectedList.length > 0 && queryRows && queryRows.length > 0) {
            const initialSelected = [];
            this.selectedList.forEach(initialRow => {
                if (queryRows.some(row => this.identity(row) === this.identity(initialRow))) {
                    initialSelected.push(initialRow);
                } else {
                    missing = true;
                }
            });
            if (missing) {
                this.selectedList = [...initialSelected];
            }
        }
        return missing;
    }

    onSelectMultiple(row: any, checked: boolean) { }
    onSelectAll(checked: boolean) { }

    prepareSelect() {
        this.selectedList = this.selectedList.filter(selected => !selected.disabled);
    }

    queryResult(result: any) {
        this.queryList = [...result.rows];
        if (this.page) {
            this.page.totalElements = result.count;
        }
        this.queryList = this.excludeRows(this.queryList);
    }

    isDisableSelectAll() {
        return this.queryList.length === 0 || this.queryList.some(detail => detail.disabled);
    }

    getSelectSummaryValue(column: string) {
        let summary = 0;
        this.selectedList.forEach(select => {
            if (select[column]) {
                if (select.isNegative) {
                    summary -= select[column];
                } else {
                    summary += select[column];
                }
            } else {
                summary = null;
            }
        });
        return summary;
    }

    search() { }

    searchFunction() {
        if (this.page) {
            this.page.index = 0;
        }
        this.search();
    }
}
