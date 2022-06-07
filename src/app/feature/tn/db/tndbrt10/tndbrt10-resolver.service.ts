import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot } from '@angular/router';
import { forkJoin, Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { Tndbrt10Service, DbPosition } from './tndbrt10.service';

@Injectable({
  providedIn: 'root'
})
export class Tndbrt10Resolver implements Resolve<any> {

  constructor(private router: Router, private db: Tndbrt10Service) { }
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
        const param = this.router.getCurrentNavigation().extras.state;
        const detailResult = param && param. positionCode ?
            this.db.findDbPositionByKey(param.positionCode) : of({} as DbPosition);
        return forkJoin([detailResult]).pipe(map((result) => {
            const detail = result[0];
            return {
                detail
            };
        }));
    }
}
