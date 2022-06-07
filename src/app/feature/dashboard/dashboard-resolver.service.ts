import { Injectable } from '@angular/core';
import { Router, Resolve, RouterStateSnapshot, ActivatedRouteSnapshot } from '@angular/router';
import { Observable, forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';
import { DashboardService } from './dashboard.service';

@Injectable()
export class DashboardResolver implements Resolve<any> {
    constructor(
        private router: Router,
        private db: DashboardService
    ) { }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
        return forkJoin([this.db.findMasterData(), this.db.findTaTimeAttendanceByUser()]).pipe(map((result) => {
            return {
                masterData: result[0],
                detail: result[1]
            };
        }));
    }
}
