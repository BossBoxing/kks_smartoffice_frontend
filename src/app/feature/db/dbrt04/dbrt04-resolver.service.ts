import { Injectable } from '@angular/core';
import { Router, Resolve, RouterStateSnapshot, ActivatedRouteSnapshot } from '@angular/router';
import { PermissionService } from '@app/shared/service/permission.service';
import { Observable, of, forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';
import { DbCountry, Dbrt04Service } from './dbrt04.service';

@Injectable()
export class Dbrt04Resolver implements Resolve<any> {
    constructor(private router: Router, private db: Dbrt04Service, private ps: PermissionService) { }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
        const param = this.router.getCurrentNavigation().extras.state;
        const detailResult = param && param.countryCode
                    ? this.db.findDbCountryByKey(param.countryCode)
                    : of({} as DbCountry);
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
