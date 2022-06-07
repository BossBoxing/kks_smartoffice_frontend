import { Injectable } from '@angular/core';
import { Router, Resolve, RouterStateSnapshot, ActivatedRouteSnapshot } from '@angular/router';
import { PermissionService } from '@app/shared/service/permission.service';
import { Observable, of, forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';
import { DbTitle, Dbrt03Service } from './dbrt03.service';

@Injectable()
export class Dbrt03Resolver implements Resolve<any> {
    constructor(private router: Router, private db: Dbrt03Service, private ps: PermissionService) { }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
        const param = this.router.getCurrentNavigation().extras.state;
        const detailResult = param && param.titleCode
                    ? this.db.findDbTitleByKey(param.titleCode)
                    : of({} as DbTitle);
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
