import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { environment } from '@env/environment';
import { MessageService } from '../message.service';
import { LoadingService } from '@app/loading/loading.service';

export interface ErrorModel {
  code: string,
  parameters: string[]
}
/**
 * Adds a default error handler to all requests.
 */
@Injectable({
  providedIn: 'root'
})
export class ErrorHandlerInterceptor implements HttpInterceptor {

  constructor(private message: MessageService, private loading: LoadingService) { }
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const apiReg = new RegExp(environment.apiUrl);
    const repotReg = new RegExp(environment.reportUrl);
    if (apiReg.test(request.url)) {
      return next.handle(request).pipe(catchError(error => this.errorHandler(error)));
    } else if (repotReg.test(request.url)) {
      return next.handle(request).pipe(catchError(error => this.handleReportError(error)));
    } else {
      return next.handle(request);
    }
  }

  // Customize the default error handler here if needed
  private errorHandler(response: HttpErrorResponse): Observable<HttpEvent<any>> {
    // if (!environment.production) {
    // Do something with the error
    // }
    this.loading.forceHide();
    if (response.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      this.message.error(response.error.message);
    }
    else {
      this.handleBackendError(response);
    }

    return of();
  }

  private handleBackendError(error: HttpErrorResponse) {
    switch (error.status) {
      case 0: this.message.error(`ไม่มีการตอบรับจาก url : ${error.url} กรุณาตรวจสอบการเชื่อมต่อ`);
        break;
      case 403: this.message.warning(`คุณไม่มีสิทธิ์เข้าถึง url : ${error.url}`);
        break;
      case 401: this.message.warning(`คุณไม่มีสิทธิ์เข้าถึงเนื้อหา`);
        break;
      case 500: /* environment.production ? this.message.error('พบข้อผิดพลาดกรุณาติดต่อผู้ดูแลระบบ') : */ this.message.error(error.error.errors.code);
        break;
      case 400:
      case 404:
        const backendError = error.error;
        if (backendError == null && error.status == 404) {
          this.message.error(`ไม่พบ url : ${error.url}`);
        }
        else if (backendError.errors) {
          if (backendError.errors instanceof Array) {
            (backendError.errors as ErrorModel[]).forEach((item: ErrorModel) => this.message.error(item.code, item.parameters));
          } else if (backendError.errors.code) {
            this.message.error(backendError.errors.code, backendError.errors.parameters);
          } else {
            this.message.error(JSON.stringify(backendError.errors));
          }
        }
        else this.message.error(backendError);
        break;
    }
  }

  private handleReportError(error: HttpErrorResponse): Observable<HttpEvent<any>> {
    let response = error.error;
    if (response && typeof(response) === 'string') {
      try {
        response = JSON.parse(error.error);
      } catch (e) {}
    }
    switch (error.status) {
      case 0: this.message.error(`การเชื่อมต่อล้มเหลว`);
        break;
      case 403: this.message.warning(`คุณไม่มีสิทธิ์เข้าถึงข้อมูลที่ร้องขอ`);
        break;
      case 500: this.message.error((response.message ? response.message : response), null, 8000);
        break;
      default: this.message.error(response + ' - ' + error.message);
    }
    return of();
  }
}