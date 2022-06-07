import { Injectable } from '@angular/core';
import { Router, Resolve, RouterStateSnapshot, ActivatedRouteSnapshot } from '@angular/router';
import { PermissionService } from '@app/shared/service/permission.service';
import { forkJoin, Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { PlRelease, Plrt02Service } from './plrt02.service';

@Injectable({
  providedIn: 'root'
})
export class Plrt02Resolver implements Resolve<any> {
  constructor(private router: Router, private service: Plrt02Service, private ps: PermissionService) { }
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
    const param = this.router.getCurrentNavigation()?.extras.state;
    const masterResult = this.service.findMasterData();
    const detailResult = param && param.custCode && param.releaseCode ?
      this.service.findPlReleaseByKey(param.custCode, param.releaseCode) : of({} as PlRelease);
    return forkJoin([detailResult, this.ps.getMenuPermission(route.data.code), masterResult]).pipe(map((result) => {
      const detail = result[0];
      const permission = result[1];
      const masterData = result[2];
      return { detail, permission, masterData };
    }));
  }
}
