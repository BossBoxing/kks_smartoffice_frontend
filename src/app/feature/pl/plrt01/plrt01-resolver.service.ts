import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot } from '@angular/router';
import { PermissionService } from '@app/shared/service/permission.service';
import { forkJoin, Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { Plrt01Service, PlCustomer } from './plrt01.service';

@Injectable()
export class Plrt01Resolver implements Resolve<any> {
    constructor(private router: Router, private pl: Plrt01Service, private ps: PermissionService) { }
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
        const param = this.router.getCurrentNavigation().extras.state;
        const detailResult = param && param.custCode ?
                    this.pl.findplCustomerByKey(param.custCode)
                    : of({} as PlCustomer);
        return forkJoin([detailResult, this.ps.getMenuPermission(route.data.code)]).pipe(map((result) => {
            const detail = result[0];
            const permission = result[1];
            return {
                detail,
                permission
            };
        }));
    }
}
