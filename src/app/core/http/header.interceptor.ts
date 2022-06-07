import { Injectable, Injector } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest } from '@angular/common/http';
import { Observable, combineLatest } from 'rxjs';
import { I18nService } from '../i18n.service';
import { environment } from '@env/environment';
import { switchMap, first } from 'rxjs/operators';
import { OrganizationService } from '../authentication/organization.service';
import { AuditService } from '../authentication/audit.service';

/**
 * Set user info header when requesting`.
 */
@Injectable({
    providedIn: 'root'
})
export class HeaderInterceptor implements HttpInterceptor {
    private orgService: OrganizationService;
    constructor(private audit: AuditService, private i18n: I18nService, private injector: Injector) { }
    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        if (this.orgService === undefined) {
            this.orgService = this.injector.get(OrganizationService);
        }

        const reg = new RegExp(environment.apiUrl);
        if (reg.test(request.url)) {
            return combineLatest(this.orgService.company, this.orgService.division,this.orgService.ready).pipe(
                first(([comp,div,ready])=>ready),
                switchMap(([comp, div,ready]) => {
                    let headers = Object.assign({}, {
                        language: this.i18n.language || this.i18n.defaultLanguage,
                        company: comp
                    })
                    if (div) Object.assign(headers, { division: div });
                    if (this.audit.code) Object.assign(headers, { program: this.audit.code.toUpperCase() });
                    return next.handle(request.clone({ setHeaders: headers }));
                })
            )
        }

        return next.handle(request);
    }
}   