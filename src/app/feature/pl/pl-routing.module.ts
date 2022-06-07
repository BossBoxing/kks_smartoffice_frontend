import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CanDeactivateGuard, AuthorizationGuard } from '@app/core';
import { Plrt01DetailComponent } from './plrt01/plrt01-detail/plrt01-detail.component';
import { Plrt01Component } from './plrt01/plrt01.component';
import { Plrt01Resolver } from './plrt01/plrt01-resolver.service';
import { Plrt02DetailComponent } from './plrt02/plrt02-detail.component';
import { Plrt02Component } from './plrt02/plrt02.component';
import { Plrt02Resolver } from './plrt02/plrt02-resolver.service';
import { Plrt03DetailComponent } from './plrt03/plrt03-detail/plrt03-detail.component';
import { Plrt03Component } from './plrt03/plrt03.component';
import { Plrt03Resolver } from './plrt03/plrt03-resolver.service';
import { Pldt01Component } from './pldt01/pldt01.component';
import { Pldt01Resolver } from './pldt01/pldt01-resolver.service';
import { Plrp01Component } from './plrp01/plrp01.component';
import { Plrp01Resolver } from './plrp01/plrp01-resolver.service';
import { Plrt03LookupComponent } from './plrt03/plrt03-lookup/plrt03-lookup.component';

const routes: Routes = [
  {
    path: '',
    canActivate: [AuthorizationGuard],
    canActivateChild: [AuthorizationGuard],
    children: [
      {
        path: 'pldt01',
        component: Pldt01Component,
        resolve: {
          pldt01: Pldt01Resolver
        }
      }, {
        path: 'plrp01',
        component: Plrp01Component,
        resolve: {
          plrp01: Plrp01Resolver
        }
      }, {
        path: 'plrt01',
        component: Plrt01Component,
        resolve: {
          plrt01: Plrt01Resolver
        },
        data: {
          code: Plrt01Component.programCode
        }
      }, {
        path: 'plrt01/detail',
        component: Plrt01DetailComponent,
        resolve: {
          plrt01: Plrt01Resolver
        },
        data: {
          code: Plrt01Component.programCode
        },
        canDeactivate: [CanDeactivateGuard],
        runGuardsAndResolvers: 'always'
      }, {
        path: 'plrt02',
        component: Plrt02Component,
        resolve: {
          plrt02: Plrt02Resolver
        },
        data: {
          code: Plrt02Component.programCode
        }
      }, {
        path: 'plrt02/detail',
        component: Plrt02DetailComponent,
        resolve: {
          plrt02: Plrt02Resolver
        },
        data: {
          code: Plrt02Component.programCode
        },
        canDeactivate: [CanDeactivateGuard],
        runGuardsAndResolvers: 'always'
      }, {
        path: 'plrt03',
        component: Plrt03Component,
        resolve: {
          plrt03: Plrt03Resolver
        },
        data: {
          code: Plrt03Component.programCode
        }
      }, {
        path: 'plrt03/detail',
        component: Plrt03DetailComponent,
        resolve: {
          plrt03: Plrt03Resolver
        },
        data: {
          code: Plrt03Component.programCode
        },
        canDeactivate: [CanDeactivateGuard],
        runGuardsAndResolvers: 'always'
      }
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [
    Pldt01Resolver,
    Plrp01Resolver,
    Plrt01Resolver,
    Plrt02Resolver,
    Plrt03Resolver
  ]
})
export class PlRoutingModule { }
