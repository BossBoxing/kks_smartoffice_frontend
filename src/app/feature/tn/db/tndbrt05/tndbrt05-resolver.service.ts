import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot } from '@angular/router';
import {  Observable, forkJoin, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { Tndbrt05Service, DbProvince } from './tndbrt05.service';

@Injectable()
export class Tndbrt05Resolver implements Resolve<any> {
  constructor(private router: Router, private db: Tndbrt05Service) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
      const param = this.router.getCurrentNavigation().extras.state;
      const detailResult = param && param.provinceCode ?
          this.db.findDbProvinceByKey(param.provinceCode, param.countryCode) : of ({} as DbProvince);
      return forkJoin([detailResult]).pipe(map((result) => {
          const detail = result[0];
          return {
              detail
          };
      }));
  }
}
