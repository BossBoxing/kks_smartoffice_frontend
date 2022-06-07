import { Observable } from 'rxjs';

export interface ModalResolve<T>{
    resolve(resolverParam?:any):Observable<T>
}