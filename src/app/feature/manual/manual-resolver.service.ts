import { Injectable } from '@angular/core';
import {
    Router, Resolve, RouterStateSnapshot,
    ActivatedRouteSnapshot, ActivatedRoute
} from '@angular/router';
import { ParameterService } from '@app/shared';
import { pipe, Observable, of, forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class ManualResolver implements Resolve<any> {
    constructor(private router: Router, private ps: ParameterService) { }
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
        return this.ps.getParameters('Manual_SOS');
    }
}