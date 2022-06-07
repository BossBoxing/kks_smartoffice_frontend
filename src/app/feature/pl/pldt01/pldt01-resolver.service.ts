import { Injectable } from '@angular/core';
import { Resolve, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable, forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';
import { Pldt01Service } from './pldt01.service';

@Injectable()
export class Pldt01Resolver implements Resolve<any> {
  constructor(private router: Router, private pl: Pldt01Service) { }
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
    const detailResult = this.pl.findPlTaskEntrys();
    const masterData = this.pl.findMasterData();
    return forkJoin([detailResult, masterData]).pipe(map((result) => {
      const detail = result[0];
      const master = result[1];
      return { detail, master };
    }));
  }
}
