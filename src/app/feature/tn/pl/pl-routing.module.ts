import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CanDeactivateGuard, AuthorizationGuard } from '@app/core';
import { Plrt01DetailComponent } from './plrt01/plrt01-detail/plrt01-detail.component';
import { Plrt01Component } from './plrt01/plrt01.component';
import { Plrt02Component } from './plrt02/plrt02.component';
import { Plrt02DetailComponent } from './plrt02/plrt02-detail.component';
import { Plrt02Resolver } from './plrt02/plrt02-resolver.service';
import { Plrt03Resolver } from './plrt03/plrt03-resolver.service';
import { Plrt03DetailComponent } from './plrt03/plrt03-detail/plrt03-detail.component';
import { Plrt03LookupComponent } from './plrt03/plrt03-lookup/plrt03-lookup.component';
import { Plrt03Component } from './plrt03/plrt03.component';
import { Plrt01Resolver } from './plrt01/plrt01-resolver.service';

const routes: Routes = [
  {
    path: '',
    canActivate: [AuthorizationGuard],
    canActivateChild: [AuthorizationGuard],
    children: [
      {
        path: 'plrt01',
        component: Plrt01Component,
      }, {
        path: 'plrt01/detail',
        component: Plrt01DetailComponent,
        resolve: {
          plrt01: Plrt01Resolver
        },
        canDeactivate: [CanDeactivateGuard],
        runGuardsAndResolvers: 'always'
      }, {
        path: 'plrt02', component: Plrt02Component,
      }, {
        path: 'plrt02/detail', component: Plrt02DetailComponent,
        resolve: {
          plrt02: Plrt02Resolver
        },
        canDeactivate: [CanDeactivateGuard],
        runGuardsAndResolvers: 'always'
      }, {
        path: 'plrt03',
        component: Plrt03Component,
      }, {
        path: 'plrt03/detail',
        component: Plrt03DetailComponent,
        resolve: {
          plrt03: Plrt03Resolver
        },
        canDeactivate: [CanDeactivateGuard],
        runGuardsAndResolvers: 'always'
      }, {
        path: 'plrt03/lookup',
        component: Plrt03LookupComponent
      }
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [
    Plrt01Resolver,
    Plrt02Resolver,
    Plrt03Resolver
  ]
})
export class PlRoutingModule { }
