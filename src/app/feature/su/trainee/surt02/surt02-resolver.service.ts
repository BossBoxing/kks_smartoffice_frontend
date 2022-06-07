import { Injectable } from '@angular/core';
import { Router, Resolve, RouterStateSnapshot, ActivatedRouteSnapshot } from '@angular/router';
import { Observable, of, forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';
import { SuUser, Surt02Service } from './surt02.service';

@Injectable()
export class Surt02Resolver implements Resolve<any> {
    constructor(private router: Router, private su: Surt02Service) { }
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
        const param = this.router.getCurrentNavigation().extras.state;
        const detailResult = param && param.userId ? this.su.findsuUserByKey(param.userId, param.profileId) : of({} as SuUser);
        return forkJoin([detailResult]).pipe(map((result) => {
            const detail = result[0];
            return {
                detail
            };
        }));
    }
}
