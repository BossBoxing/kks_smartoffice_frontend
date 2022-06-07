import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class ParameterService {
    constructor(private http:HttpClient) { }

    getParameter(group:string,code:string){
        return this.http.get<any>(`parameter/${group}/${code || ''}`);
    }

    getParameters(group:string){
        return this.http.get<any>('parameter',{ params:{ group : group }});
    }
}