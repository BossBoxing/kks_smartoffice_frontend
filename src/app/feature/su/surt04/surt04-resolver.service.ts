import { Injectable } from '@angular/core';
import { Resolve, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Surt04Service, SuProfile } from './surt04.service';
import { Observable, of, forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class Surt04Resolver implements Resolve<any> {

  constructor(
    private router: Router,
    private su: Surt04Service) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
    const param = this.router.getCurrentNavigation().extras.state;
    const readOnly = param && param.readOnly ? param.readOnly : false;
    const detailResult = param && param.code ? this.su.findSuProfileByKey(param.code, readOnly) : of({});

    return forkJoin([detailResult]).pipe(map((result) => {
      const detail = result[0];
      return { detail };
    }));
  }
}
