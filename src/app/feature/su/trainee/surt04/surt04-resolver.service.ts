import { Injectable } from '@angular/core';
import { Router, Resolve, RouterStateSnapshot, ActivatedRouteSnapshot } from '@angular/router';
import { Observable, of, forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';
import { SuProfile, Surt04Service } from './surt04.service';

@Injectable()
export class Surt04Resolver implements Resolve<any> {
    constructor(private router: Router, private ar: Surt04Service) { }
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
        const param = this.router.getCurrentNavigation().extras.state;
        const detailResult = param && param.profileId ? this.ar.findsuProfileByKey(param.profileId) : of({} as SuProfile);
        return forkJoin([detailResult]).pipe(map((result) => {
            const detail = result[0];
            return {
                detail
            };
        }));
    }
}
