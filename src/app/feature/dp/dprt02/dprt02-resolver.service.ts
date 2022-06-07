import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot } from '@angular/router';
import { forkJoin, Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { Dprt02Service} from './dprt02.service';

@Injectable()
export class Dprt02Resolver implements Resolve<any> {
    constructor(private router: Router, private dp: Dprt02Service) { }
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
        const param = this.router.getCurrentNavigation().extras.state;
        let detailResult;
        if (state.url.includes('detail')) {
            detailResult = param && param.evaluationYear && param.evaluationPeriod
                ? this.dp.findDpPeriodByKey(param.evaluationYear, param.evaluationPeriod)
                : this.dp.findDpPeriodByKey(0, 0);
        }
        return forkJoin([detailResult]).pipe(map((result) => {
            const detail = result[0];
            return { detail };
        }));
    }
}
