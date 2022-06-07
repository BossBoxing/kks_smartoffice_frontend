import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot } from '@angular/router';
import { forkJoin, Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { DbTitle, Tndbrt03Service } from './tndbrt03.service';

@Injectable()
export class Tndbrt03Resolver implements Resolve<any> {
  constructor(private router: Router, private db: Tndbrt03Service) { }
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
        const param = this.router.getCurrentNavigation().extras.state;
        const detailResult = param && param.titleCode ?
            this.db.findDbTitleByKey(param.titleCode) : of({} as DbTitle);
        return forkJoin([detailResult]).pipe(map((result) => {
            const detail = result[0];
            return {
                detail
            };
        }));
    }
}
