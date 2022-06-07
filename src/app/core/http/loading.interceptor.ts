import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';

import { LoadingService } from '@app/loading/loading.service';
import { finalize } from 'rxjs/operators';

/**
 * Block UI when requesting`.
 */
@Injectable({
    providedIn: 'root'
})
export class LoadingInterceptor implements HttpInterceptor {
    constructor(public ls: LoadingService) { }
    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        this.ls.show();
        return next.handle(request).pipe(
            finalize(() => this.ls.hide())
        );
    }
}