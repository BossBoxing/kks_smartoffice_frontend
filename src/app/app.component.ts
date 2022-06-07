import { Component } from '@angular/core';
import { Location } from '@angular/common';
import {
  Router, RouteConfigLoadStart, GuardsCheckEnd,
  NavigationEnd, RouteConfigLoadEnd, NavigationStart,
  NavigationCancel, GuardsCheckStart, ResolveStart,
  ResolveEnd, ActivatedRoute
} from '@angular/router';
import { LoadingService } from './loading/loading.service';
import { I18nService, UpdateService, AuditService, AuthService } from './core';
import { filter, takeUntil, map, switchMap } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  protected ngUnsubscribe: Subject<void> = new Subject<void>();
  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private ls: LoadingService,
    private i18n: I18nService,
    private auth: AuthService,
    private audit: AuditService,
    private update: UpdateService
  ) {

  }

  // tslint:disable-next-line:use-lifecycle-interface
  ngOnInit() {
    this.auth.init();
    this.update.init();
    this.i18n.init();
    this.router.events.pipe(takeUntil(this.ngUnsubscribe)).subscribe((evt) => {
      // block ui when lazyloading start
      if (evt instanceof RouteConfigLoadStart || evt instanceof GuardsCheckEnd) {
        this.ls.show();
      } else if (evt instanceof RouteConfigLoadEnd || evt instanceof NavigationEnd || evt instanceof NavigationCancel) {
        this.ls.hide();
      }
    });

    // https://github.com/angular/angular/issues/28108
    let state = null;
    this.router.events.pipe(takeUntil(this.ngUnsubscribe)).subscribe(e => {
      if (e instanceof NavigationStart && e.navigationTrigger === 'popstate') {
        if (state != null) {
          this.router.getCurrentNavigation().extras.state = { ...state, navigationId: e.id };
          state = null;
        } else {
          this.router.getCurrentNavigation().extras.state = { ...e.restoredState, navigationId: e.id };
        }
      } else if (e instanceof NavigationCancel) {
        state = this.router.getCurrentNavigation().previousNavigation && this.router.getCurrentNavigation().previousNavigation.extras.state;
      }
    });

    const onNavigationEnd = this.router.events.pipe(filter(event => event instanceof NavigationEnd));

    // Change page title on navigation or language change, based on route data
    onNavigationEnd.pipe(
      map(() => {
        let route = this.activatedRoute;
        while (route.firstChild) {
          route = route.firstChild;
        }
        return route;
      }),
      filter(route => route.outlet === 'primary'),
      switchMap(route => route.data),
      takeUntil(this.ngUnsubscribe)
    ).subscribe(event => {
      const code = event.code;
      this.audit.code = code;
      const roleCode = event.roleCode;
      this.audit.role = roleCode;
    });
  }
  // tslint:disable-next-line:use-lifecycle-interface
  ngOnDestroy() {
    this.auth.destory();
    this.i18n.destroy();
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
