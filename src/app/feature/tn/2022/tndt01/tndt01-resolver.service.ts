import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot } from '@angular/router';
import { forkJoin, Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { TnIdpTransMaster, Tndt01Service } from './tndt01.service';

@Injectable()
export class Tndt01Resolver implements Resolve<any> {
  constructor(private router: Router, private db: Tndt01Service) { }
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
        const param = this.router.getCurrentNavigation().extras.state;
        const detailResult = param && param.transNo ?
            this.db.findTnIdpTransByKey(param.transNo) : of({} as TnIdpTransMaster);
        return forkJoin([detailResult]).pipe(map((result) => {
            const detail = result[0];
            return {
                detail
            };
        }));
    }
}
