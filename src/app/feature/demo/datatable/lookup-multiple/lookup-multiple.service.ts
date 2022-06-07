import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
 

@Injectable()
export class LookupMultipleService {
    
    constructor(private http:HttpClient){}
    getCategories(search: string, page: any) {
        const filter = Object.assign({ keyword: search }, page);
        filter.sort = page.sort || 'categoryCode'
        return this.http.get<any>('csrt01', { params: filter });
    }

}