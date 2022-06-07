import { Observable, Subject } from 'rxjs';

export interface BaseLookup {
     single(param:any,keyword:any):Observable<any[]>;
     description(key:any,param:any):Observable<any>;
}