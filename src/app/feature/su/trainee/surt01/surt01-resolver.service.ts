import { Injectable } from '@angular/core';
import { Router, Resolve, RouterStateSnapshot, ActivatedRouteSnapshot } from '@angular/router';
import { Observable, of, forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';
import { SuUser, Surt01Service } from './surt01.service';

@Injectable()
export class Surt01Resolver implements Resolve<any> {
    constructor(private router: Router, private su: Surt01Service) { }
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
        const param = this.router.getCurrentNavigation().extras.state;
        const detailResult = param && param.Id ? this.su.findsuUserByKey(param.Id, param.empId) : of({} as SuUser);
        return forkJoin([detailResult]).pipe(map((result) => {
            const detail = result[0];
            return {
                detail
            };
        }));
    }
}
