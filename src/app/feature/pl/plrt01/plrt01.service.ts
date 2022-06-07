import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';

export interface PlCustomer {
    custCode: string;
    custName: string;
    telNo: string;
    faxNo: string;
    active: string;
    crDate: Date;
    areaCode: string;
    countryCode: string;
    color: string;
    address: string;
    effectiveDate: Date;
    activeBool: boolean;
    rowVersion: number;
}

@Injectable()
export class Plrt01Service {
    constructor(private http: HttpClient) { }

    findUsers() {
        return this.http.get<any>('plrt01');
    }
    findPlCustomer(searchCriteria: any, page: any) {
        const filter = Object.assign(searchCriteria, page);
        return this.http.get<any>('plrt01', { params: filter });
    }

    findplCustomerByKey(code) {
        return this.http.get<PlCustomer>('plrt01/detail', { params: { custCode: code } });
    }

    delete(code, version) {
        return this.http.delete('plrt01', {
            params: { custCode: code, rowVersion: version },
        });
    }

    save(plCustomer: PlCustomer, formGroup: FormGroup) {
        const pl = Object.assign({}, plCustomer, formGroup);
        if (pl.rowVersion) {
            return this.http.put<any>('plrt01', pl);
        } else {
            return this.http.post<any>('plrt01', pl);
        }
    }
}
