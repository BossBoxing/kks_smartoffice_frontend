import { Injectable } from '@angular/core';
import { Router, CanActivate, CanLoad, ActivatedRouteSnapshot, RouterStateSnapshot, Route, CanActivateChild } from '@angular/router';
import { Observable, of } from 'rxjs';
import { AuthService } from '../authentication/auth.service';
import { map, switchMap } from 'rxjs/operators';
import { MessageService } from '../message.service';

@Injectable({
    providedIn: 'root'
})
export class AuthorizationGuard implements CanActivate, CanLoad, CanActivateChild {

    constructor(private authService: AuthService, private router: Router, private ms: MessageService) { }

    canActivate(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): Observable<boolean> {
        return this.checkUser(state);
    }
    canActivateChild(
        childRoute: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): Observable<boolean> {
        const code = (childRoute.data.code || '').toUpperCase();
        return this.checkUser(state).pipe(
            switchMap(login => {
                if (login) {
                    //    return this.authService.claims
                    return this.authService.canAccess(code);
                } else {
                    return of(null);
                }
            }),
            map(claim => {
                // const code = (childRoute.data.code || '').toUpperCase();
                // if (claim.role.length && (claim.role.includes(code) || code == '' )){
                //   return true;
                // }
                if (claim || code === '') {
                    return true;
                } else {
                    this.ms.warning('message.STD00039');
                }
            })
        );
    }
    canLoad(state: Route): Observable<boolean> {
        return this.checkUser(state);
    }

    private checkUser(state): Observable<boolean> {
        return this.authService.isLoggedIn.pipe(
            map(login => {
                if (login) {
                    return true;
                } else {
                    this.authService.redirectUrl = state.url;
                    this.authService.signin();
                    return false;
                }
            })
        );
    }
}
