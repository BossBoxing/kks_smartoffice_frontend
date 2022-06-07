import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CanDeactivateGuard, AuthorizationGuard } from '@app/core';
import { Dprt01DetailComponent } from './dprt01/dprt01-detail.component';
import { Dprt01GuideDetailComponent } from './dprt01/dprt01-guide-detail.component';
import { Dprt01Resolver } from './dprt01/dprt01-resolver.service';
import { Dprt01Component } from './dprt01/dprt01.component';
import { Dprt02DetailComponent } from './dprt02/dprt02-detail.component';
import { Dprt02Resolver } from './dprt02/dprt02-resolver.service';
import { Dprt02Component } from './dprt02/dprt02.component';
import { Dpdt01Component } from './dpdt01/dpdt01.component';
import { Dpdt02Component } from './dpdt02/dpdt02.component';
import { Dpdt01DetailComponent } from './dpdt01/dpdt01-detail.component';
import { Dpdt02DetailComponent } from './dpdt02/dpdt02-detail.component';
import { Dpdt01Resolver } from './dpdt01/dpdt01-resolver.service';
import { Dprt02Service } from './dprt02/dprt02.service';
import { Dprt01Service } from './dprt01/dprt01.service';
import { Dpdt02Resolver } from './dpdt02/dpdt02-resolver.service';

const routes: Routes = [
  {
    path: '',
    canActivate: [AuthorizationGuard],
    canActivateChild: [AuthorizationGuard],
    children: [
      {
        path: 'dprt01',
        component: Dprt01Component,
      },
      {
        path: 'dprt01/detail',
        component: Dprt01DetailComponent,
        resolve: {
          dprt01: Dprt01Resolver
        },
        canDeactivate: [CanDeactivateGuard],
        runGuardsAndResolvers: 'always'
      },
      {
        path: 'dprt01/guide',
        component: Dprt01GuideDetailComponent,
        resolve: {
          dprt01: Dprt01Resolver
        },
        canDeactivate: [CanDeactivateGuard],
        runGuardsAndResolvers: 'always'
      },
      {
        path: 'dprt02',
        component: Dprt02Component,
      },
      {
        path: 'dprt02/detail',
        component: Dprt02DetailComponent,
        resolve: {
          dprt02: Dprt02Resolver
        },
        canDeactivate: [CanDeactivateGuard],
        runGuardsAndResolvers: 'always'
      },
      {
        path: 'dpdt01',
        component: Dpdt01Component,
        resolve: {
          dpdt01: Dpdt01Resolver
        }
      },
      {
        path: 'dpdt01/detail',
        component: Dpdt01DetailComponent,
        resolve: {
          dpdt01: Dpdt01Resolver
        },
        canDeactivate: [CanDeactivateGuard],
        runGuardsAndResolvers: 'always'
      },
      {
        path: 'dpdt02',
        component: Dpdt02Component,
        resolve: {
          dpdt02: Dpdt02Resolver
        }
      },
      {
        path: 'dpdt02/detail',
        component: Dpdt02DetailComponent,
        resolve: {
          dpdt02: Dpdt02Resolver
        },
        canDeactivate: [CanDeactivateGuard],
        runGuardsAndResolvers: 'always'
      },
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [
    Dpdt01Resolver,
    Dpdt02Resolver,
    Dprt01Resolver,
    Dprt02Resolver
  ]
})
export class DpRoutingModule { }
