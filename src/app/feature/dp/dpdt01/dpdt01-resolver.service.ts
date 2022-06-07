import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot } from '@angular/router';
import { forkJoin, Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { Dpdt01Service, DpTransectionMaster } from './dpdt01.service';

@Injectable()
export class Dpdt01Resolver implements Resolve<any> {
    constructor(private router: Router, private dp: Dpdt01Service) { }
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
        const param = this.router.getCurrentNavigation().extras.state;
        const readOnly = param && param.readOnly ? param.readOnly : false;
        let detailResult;
        let masterDataResult;
        if (state.url.includes('detail')) {
            detailResult = param && param.transNo
                ? this.dp.findDpTransectionMasterByKey(param.transNo)
                : this.dp.findDpTransectionMasterByKey('');
            masterDataResult = this.dp.findMasterData('detail');
        } else {
            detailResult = of({} as DpTransectionMaster);
            masterDataResult = this.dp.findMasterData(null);
        }
        return forkJoin([detailResult, masterDataResult]).pipe(map((result) => {
            const detail = result[0];
            const masterData = result[1];
            return {
                detail,
                masterData
            };
        }));
    }
}
