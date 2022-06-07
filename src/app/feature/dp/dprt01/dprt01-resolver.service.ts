import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot } from '@angular/router';
import { forkJoin, Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { DpFormatMaster, Dprt01Service } from './dprt01.service';

@Injectable()
export class Dprt01Resolver implements Resolve<any> {
    constructor(private router: Router, private dp: Dprt01Service) { }
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
        const param = this.router.getCurrentNavigation().extras.state;
        let detailResult;
        let masterDataResult;
        if (state.url.includes('detail')) {
            detailResult = param && param.docFormatNo ?
                this.dp.findDpFormatMasterByKey(param.docFormatNo, null) : of({} as DpFormatMaster);
            masterDataResult = this.dp.findMasterData('detail');
        } else if (state.url.includes('guide')) {
            detailResult = param && param.docFormatNo && param.topicNo ?
                this.dp.findDpFormatMasterByKey(param.docFormatNo, param.topicNo) : of({} as DpFormatMaster);
            masterDataResult = this.dp.findMasterData('detail');
        } else {
            detailResult = of({} as DpFormatMaster);
            masterDataResult = this.dp.findMasterData(null);
        }
        return forkJoin([detailResult, masterDataResult]).pipe(map((result) => {
            const detail = result[0];
            const masterData = result[1];
            return { detail, masterData };
        }));
    }
}
