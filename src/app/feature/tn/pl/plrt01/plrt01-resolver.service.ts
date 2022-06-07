import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot } from '@angular/router';
import { forkJoin, Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { Plrt01Service, PlCustomer } from './plrt01.service';

@Injectable()
export class Plrt01Resolver implements Resolve<any> {
    constructor(private router: Router, private pl: Plrt01Service) { }
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
        const param = this.router.getCurrentNavigation().extras.state;
        console.log(param);
        const detailResult = param && param.custCode ?
            this.pl.findplCustomerByKey(param.custCode) : of({} as PlCustomer);
        return forkJoin([detailResult]).pipe(map((result) => {
            const detail = result[0];
            return {
                detail
            };
        }));
    }
}
