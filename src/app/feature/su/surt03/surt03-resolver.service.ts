import { Injectable } from '@angular/core';
import { Resolve, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Surt03Service } from './surt03.service';
import { Observable, of, forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class Surt03Resolver implements Resolve<any> {

  constructor(
      private router: Router
    , private su: Surt03Service
  ) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
    const param = this.router.getCurrentNavigation().extras.state;
    const readOnly = param && param.readOnly ? param.readOnly : false;
    const detailResult = param && param.menuCode ? this.su.findSuMenuInfoByKeys(param.menuCode) : of({});
    const masterResult = param && param.programCode ? this.su.findMasterData({ systemCode: param.systemCode, menuCode: param.menuCode })
                                                    : this.su.findMasterData({});
    return forkJoin([detailResult
                    , masterResult]
    ).pipe(map((result) => {
      const detail = result[0];
      const masterData = result[1];
      return { detail, masterData };
    }));
  }
}
