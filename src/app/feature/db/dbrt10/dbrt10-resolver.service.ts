import { Injectable } from '@angular/core';
import { Router, Resolve, RouterStateSnapshot, ActivatedRouteSnapshot } from '@angular/router';
import { PermissionService } from '@app/shared/service/permission.service';
import { Observable, of, forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';
import { Dbrt10Service, DbPosition } from './dbrt10.service';

@Injectable()
export class Dbrt10Resolver implements Resolve<any> {
    constructor(private router: Router, private db: Dbrt10Service,  private ps: PermissionService) { }
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
        const param = this.router.getCurrentNavigation().extras.state;
        const detailResult = param && param.positionCode ? this.db.findDbPositionByKey(param.positionCode) : of({} as DbPosition);
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
