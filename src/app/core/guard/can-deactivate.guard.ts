import { Location } from '@angular/common';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanDeactivate, Router, RouterStateSnapshot } from '@angular/router';
import { Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CanDeactivateGuard implements CanDeactivate<CanComponentDeactivate> {

  constructor(
    private location: Location,
    private router: Router
  ) { }

  // https://github.com/angular/angular/issues/13586
 canDeactivate(component: CanComponentDeactivate, currentRoute: ActivatedRouteSnapshot, currentState: RouterStateSnapshot,
               nextState: RouterStateSnapshot) {
    return component.canDeactivate ? component.canDeactivate().pipe(
      switchMap((resultFromConfirmDialog: boolean) => {
        if (!resultFromConfirmDialog) {
          const currentUrlTree = this.router.createUrlTree([], currentRoute);
          const currentUrl = currentUrlTree.toString();
          if (!this.location.isCurrentPathEqualTo(currentUrl)) {
            this.location.go(currentUrl);
          }
          return of(false);
        }
        return of(true);
      }))
      : true;
  }
}

export interface CanComponentDeactivate {
  canDeactivate: () => Observable<boolean>;
}
