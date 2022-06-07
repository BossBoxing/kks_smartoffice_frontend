
import { Output, EventEmitter, Component, Inject } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap';
import { BaseList } from '@app/shared/service/base.service';
import { RowState } from '../datatable/state.enum';
import { SubscriptionDisposer } from '../subscription-disposer';

@Component({
    selector: 'app-base-lookup',
    template: 'no template'
})
export class BaseLookupComponent extends SubscriptionDisposer {

    keyword: string = '';
    parameter: any = {};
    selectedList:any[] = [];
    deleteList:any[] = [];
    @Output() selected = new EventEmitter<any>();
    constructor(
        public bsModalRef: BsModalRef
    ) { super() }

    onSelect(key: any): void {
        this.selected.next(key);
        this.bsModalRef.hide();
    }

    onClose(): void {
        this.selected.next(null);
        this.bsModalRef.hide();
    }

}