import { Injectable } from '@angular/core';
import { Router, Resolve, RouterStateSnapshot, ActivatedRouteSnapshot } from '@angular/router';
import { PermissionService } from '@app/shared/service/permission.service';
import { Observable, of, forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';
import { Dbrt05Service, DbProvince } from './dbrt05.service';

@Injectable()
export class Dbrt05Resolver implements Resolve<any> {
    constructor(private router: Router, private db: Dbrt05Service, private ps: PermissionService) { }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
        const param = this.router.getCurrentNavigation().extras.state;
        const detailResult = param && param.provinceCode
                ? this.db.findDbProvinceByKey(param.countryCode, param.provinceCode)
                : of({} as DbProvince);

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
