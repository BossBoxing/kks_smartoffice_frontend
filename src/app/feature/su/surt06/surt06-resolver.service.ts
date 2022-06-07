import { Injectable } from '@angular/core';
import { Router, Resolve, RouterStateSnapshot, ActivatedRouteSnapshot } from '@angular/router';
import { PermissionService } from '@app/shared/service/permission.service';
import { Observable, of, forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';
import { Surt06Service, SuUser } from './surt06.service';

@Injectable()
export class Surt06Resolver implements Resolve<any> {
    constructor(
        private router: Router,
        private su: Surt06Service,
        private ps: PermissionService
    ) { }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
        const param = this.router.getCurrentNavigation().extras.state;
        const readOnly = param && param.readOnly ? param.readOnly : false;
        let detailResult = of({} as SuUser);
        let masterDataResult = of({});
        let divisionResult = of([]);
        if (state.url.includes('detail')) {
            detailResult = param && param.userId
                ? this.su.findSuUserByKey(param.userId, readOnly)
                : of({} as SuUser);
            masterDataResult = this.su.findMasterData('detail');
        } else if (state.url.includes('organization')) {
            detailResult = param && param.userId
                ? this.su.findSuUserOrgByKey(param.ouCode, param.userId, readOnly)
                : of({} as SuUser);
            masterDataResult = this.su.findMasterData('organization');
            divisionResult = param && param.ouCode ? this.su.findSuDivisions({ ouCode: param.ouCode }) : of([]);
        } else {
            detailResult = of({} as SuUser);
            masterDataResult = of({});
        }

        return forkJoin([masterDataResult, detailResult, divisionResult, this.ps.getMenuPermission(route.data.code)]).pipe(map((result) => {
            const masterData = result[0];
            const detail = result[1];
            const divisions = result[2];
            const permission = result[3];
            return {
                masterData,
                detail,
                divisions,
                permission
            };
        }));
    }
}
