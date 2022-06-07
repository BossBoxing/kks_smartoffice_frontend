import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot } from '@angular/router';
import { PermissionService } from '@app/shared/service/permission.service';
import { forkJoin, Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { DbHoliday, Plrt03Service } from './plrt03.service';

@Injectable({
  providedIn: 'root'
})
export class Plrt03Resolver implements Resolve<any> {
  constructor(private router: Router, private pl: Plrt03Service, private ps: PermissionService) { }
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
    const param = this.router.getCurrentNavigation().extras.state;
    const detailResult = param && param.ouCode && param.holidayYear && param.holidayName ?
      this.pl.findDbHolidayByKey(param.ouCode, param.holidayYear, param.holidayName) : of({} as DbHoliday);
    return forkJoin([detailResult, this.ps.getMenuPermission(route.data.code)]).pipe(map((result) => {
      const detail = result[0];
      const permission = result[1];
      return { detail, permission };
    }));
  }
}
