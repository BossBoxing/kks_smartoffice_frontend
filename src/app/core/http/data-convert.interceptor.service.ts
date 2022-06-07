import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Encoder } from './encoder';
import { environment } from '@env/environment';

@Injectable({
    providedIn: 'root'
})
export class DataConvertInterceptor implements HttpInterceptor {

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const reg = new RegExp(environment.apiUrl);
        if (reg.test(request.url)) {
            let newParams = new HttpParams({ encoder: new Encoder() })
            if (request.params instanceof HttpParams) {
                request.params.keys().map((key) => {
                    let value: any = request.params.get(key);
                    newParams = newParams.append(key, value);
                })
            }

            return next.handle(request.clone({
                params: newParams
            }))
        } else return next.handle(request);
    }
}