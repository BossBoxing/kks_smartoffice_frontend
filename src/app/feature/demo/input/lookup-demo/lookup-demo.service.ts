import { Injectable } from '@angular/core';
import { BaseLookup } from '@app/shared/component/lookup/base-lookup';
import { Observable, of } from 'rxjs';

@Injectable()
export class LookupDemoService implements BaseLookup {
    items = [{value:'001',nameTha:'รายการ 1',nameEng:'item 1'},{value:'002',nameTha:'รายการ 2',nameEng:'item 2'}];

    getItems(keyword){
        return this.items.filter(o=>o.value.indexOf(keyword) > -1 || o.nameTha.indexOf(keyword) > -1);
    }
    single(param: any,keyword:any): Observable<any[]> {
        return of(this.items.filter(o=>o.value.indexOf(keyword) > -1 || o.nameTha.indexOf(keyword) > -1));
    }
    description(key: any): Observable<any> {
       return of(this.items.find(o=>o.value == key));
    }


}