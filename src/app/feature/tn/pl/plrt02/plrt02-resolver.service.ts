import { Injectable } from '@angular/core';
import { Router, Resolve, RouterStateSnapshot, ActivatedRouteSnapshot } from '@angular/router';
import { forkJoin, Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { PlRelease, Plrt02Service } from './plrt02.service';

@Injectable({
  providedIn: 'root'
})
export class Plrt02Resolver implements Resolve<any> {
  constructor(private router: Router, private service: Plrt02Service) { }
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
    const param = this.router.getCurrentNavigation()?.extras.state;
    const detailResult = param && param.custCode && param.releaseCode ?
      this.service.findPlReleaseByKey(param.custCode, param.releaseCode) : of({} as PlRelease);
    return forkJoin([detailResult]).pipe(map((result) => {
      const detail = result[0];
      return { detail };
    }));
  }
}
