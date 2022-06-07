import { Injectable } from '@angular/core';
import { Resolve, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Surt02Service } from './surt02.service';
import { Observable, of, forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class Surt02Resolver implements Resolve<any> {

  constructor(
    private router: Router,
    private su: Surt02Service,
  ) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
    const param = this.router.getCurrentNavigation().extras.state;
    const readOnly = param && param.readOnly ? param.readOnly : false;
    const detailResult = param && param.programCode
                        ? this.su.findSuProgramInfoByKey(param.programCode, readOnly)
                        : of({});
    const masterDataResult = this.su.findMasterData();
    return forkJoin([detailResult
                  , masterDataResult]
    ).pipe(map((result) => {
      const detail = result[0];
      const masterData = result[1];
      return { detail, masterData };
    }));
  }
}
