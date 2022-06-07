import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class DatatableService {
    constructor(private http: HttpClient) { }

    save(user:any[]) {
        console.log(user);
    }
}