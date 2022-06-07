import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot } from '@angular/router';
import { forkJoin, Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { Dpdt02Service, DpEvaluationMaster } from './dpdt02.service';

@Injectable()
export class Dpdt02Resolver implements Resolve<any> {
    constructor(private router: Router, private dp: Dpdt02Service) { }
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
        const param = this.router.getCurrentNavigation().extras.state;
        let detailResult;
        let masterDataResult;
        if (state.url.includes('detail')) {
            detailResult = param && param.transNo
                ? this.dp.findDpEvaluationMasterByKey(param.transNo)
                : this.dp.findDpEvaluationMasterByKey('');
            masterDataResult = this.dp.findMasterData('detail');
        } else {
            detailResult = of({} as DpEvaluationMaster);
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
