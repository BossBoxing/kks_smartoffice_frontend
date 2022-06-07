import { Injectable } from '@angular/core';
import { Router, Resolve, RouterStateSnapshot, ActivatedRouteSnapshot } from '@angular/router';
import { Observable, forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';
import { Plrp01Service } from './plrp01.service';

@Injectable()
export class Plrp01Resolver implements Resolve<any> {
    constructor(private router: Router, private pl: Plrp01Service) { }
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
        const masterDataResult = this.pl.findMasterData();
        return forkJoin([masterDataResult]).pipe(map((result) => {
            const masterData = result[0];
            return { masterData };
        }));
    }
}
