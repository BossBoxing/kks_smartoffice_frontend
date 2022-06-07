import { Injectable } from '@angular/core';
import { Router, Resolve, RouterStateSnapshot, ActivatedRouteSnapshot } from '@angular/router';
import { PermissionService } from '@app/shared/service/permission.service';
import { Observable, of, forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';
import { Dbrt11Service, GbEmployee } from './dbrt11.service';

@Injectable()
export class Dbrt11Resolver implements Resolve<any> {
    constructor(private router: Router, private db: Dbrt11Service, private ps: PermissionService) { }
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
        const param = this.router.getCurrentNavigation().extras.state;
        const masterResult = this.db.findMasterData();
        const detailResult = param && param.ouCode && param.empId
            ? this.db.findGbEmployeeByKey(param.ouCode, param.empId) : of({} as GbEmployee);
        return forkJoin([masterResult, detailResult, this.ps.getMenuPermission(route.data.code)]).pipe(map((result) => {
            const masterData = result[0];
            const detail = result[1];
            const permission = result[2];
            return { masterData, detail, permission };
        }));
    }
}
