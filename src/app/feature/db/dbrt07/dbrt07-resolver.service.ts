import { Injectable } from '@angular/core';
import { Router, Resolve, RouterStateSnapshot, ActivatedRouteSnapshot } from '@angular/router';
import { PermissionService } from '@app/shared/service/permission.service';
import { Observable, of, forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';
import { Dbrt07Service, DbRace } from './dbrt07.service';

@Injectable()
export class Dbrt07Resolver implements Resolve<any> {
    constructor(private router: Router, private db: Dbrt07Service, private ps: PermissionService) { }
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
        const param = this.router.getCurrentNavigation().extras.state;
        const detailResult = param && param.raceCode ? this.db.findDbRaceByKey(param.raceCode) : of({} as DbRace);
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
