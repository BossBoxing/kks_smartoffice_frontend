import { Injectable, Inject, ApplicationRef, NgZone } from '@angular/core';
import { UserManager, UserManagerSettings, User } from 'oidc-client';
import { environment } from '@env/environment';
import { Observable, from, of, BehaviorSubject, Subject } from 'rxjs';
import { map, switchMap, catchError, delay, first, tap, takeUntil } from 'rxjs/operators';
import { MessageService } from '../message.service';
import { HttpClient } from '@angular/common/http';
import { LoadingService } from '@app/loading/loading.service';



@Injectable({ providedIn: 'root' })
export class AuthService {

  private userSource = new BehaviorSubject<any>(null);
  user = this.userSource.asObservable();
  private redirectUrlKey = 'redirect-url';

  private managerSource = new BehaviorSubject<UserManager>(null);
  private manager = this.managerSource.asObservable().pipe(first(mang => mang != null));
  protected ngUnsubscribe: Subject<void> = new Subject<void>();
  constructor(
    private ms: MessageService,
    private http: HttpClient,
    private appRef: ApplicationRef,
    private zone: NgZone,
    @Inject('BASE_URL') private originUrl: string
  ) {}

  init() {
    this.appRef.isStable.pipe(first(isStable => isStable === true), takeUntil(this.ngUnsubscribe)).subscribe(() =>  this.zone.run(() => {
      const manager = new UserManager(getClientSettings(this.originUrl));

      manager.events.addUserLoaded(user => {
        this.userSource.next(user);
      });

      manager.events.addUserSignedOut(() => {
        this.ms.info('คุณได้ออกจากระบบแล้ว');
        manager.signoutRedirect();
      });

      this.managerSource.next(manager);
    }));
  }

  destory() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  get isLoggedIn(): Observable<boolean> {
    return this.user.pipe(
      map(user => {
        return user != null && !user.expired;
      })
    );
  }

  get claims(): Observable<any> {
    return this.user.pipe(
      map(user => user.profile)
    );
  }

  get authorizationHeader(): Observable<string> {
    return this.user.pipe(
      map(user => user ? `${user.token_type} ${user.access_token}` : '')
    );
  }

  signin() {
    this.manager.pipe(takeUntil(this.ngUnsubscribe)).subscribe(manager => manager.signinRedirect());

  }
  signout() {
    this.manager.pipe(takeUntil(this.ngUnsubscribe)).subscribe(manager => manager.signoutRedirect());
  }

  completeAuthentication() {
    return this.manager.pipe(
      switchMap(manager => {
        return from<Promise<User>>(manager.signinRedirectCallback()).pipe(
          catchError(() => of({}))
        );
      })
    );

  }

  get redirectUrl() {
    return sessionStorage.getItem(this.redirectUrlKey) || '/';
  }
  set redirectUrl(value) {
    sessionStorage.setItem(this.redirectUrlKey, value);
  }

  get personalInfo(): Observable<any> {
    return this.http.get<any>('personal').pipe(map(info => info || {}));
  }

  canAccess(ProgramCode: string): Observable<any> {
    return this.http.post<any>('menu/canAccess', {programCode: ProgramCode});
  }
}



export function getClientSettings(originalUrl): UserManagerSettings {
  return {
    authority: environment.authUrl,
    client_id: 'kks.spa',
    redirect_uri: originalUrl + '/account/auth-callback',
    post_logout_redirect_uri: originalUrl,
    response_type: 'code',
    scope: 'openid profile kks.resource.api kks.content.api report-api',
    filterProtocolClaims: false,
    loadUserInfo: true,
    automaticSilentRenew: true,
    accessTokenExpiringNotificationTime: 60,
    silent_redirect_uri: originalUrl + '/silent.html'
  };
}
