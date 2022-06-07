import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { RowState } from '../component/datatable/state.enum';
import { Guid } from 'guid-typescript';

export class BaseList {
    guid: string;
    rowState: RowState;
    form?: FormGroup;
    constructor() {
        this.guid = Guid.raw();
        this.rowState = RowState.Add;
    }
}

@Injectable({ providedIn: 'root' })
export class BaseService {
    protected prepareSaveList(details: BaseList[], detailsDelete: BaseList[]): any[] {
        details = details.filter(item => item.rowState !== RowState.Normal)
            .map(({ ...prop }) => {
                try {
                    Object.assign(prop, prop.form.getRawValue());
                    delete prop.form;
                }
                catch(err){}
                return prop;
            }).concat(detailsDelete.map(({ form, ...prop }) => {prop.rowState = RowState.Delete; return prop;}));
        return details;
    }
}