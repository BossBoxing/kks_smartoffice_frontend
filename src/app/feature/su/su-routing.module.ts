import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CanDeactivateGuard, AuthorizationGuard } from '@app/core';
import { Surt01Component } from './surt01/surt01.component';
import { Surt01Resolver } from './surt01/surt01-resolver.service';
import { Surt01DetailComponent } from './surt01/surt01-detail.component';
import { Surt02Component } from './surt02/surt02.component';
import { Surt02DetailComponent } from './surt02/surt02-detail.component';
import { Surt02Resolver } from './surt02/surt02-resolver.service';
import { Surt03Component } from './surt03/surt03.component';
import { Surt03DetailComponent } from './surt03/surt03-detail.component';
import { Surt03Resolver } from './surt03/surt03-resolver.service';
import { Surt04Component } from './surt04/surt04.component';
import { Surt04DetailComponent } from './surt04/surt04-detail.component';
import { Surt04Resolver } from './surt04/surt04-resolver.service';
import { Surt06Component } from './surt06/surt06.component';
import { Surt06Resolver } from './surt06/surt06-resolver.service';
import { Surt06DetailComponent } from './surt06/surt06-detail.component';
import { Surt06OrganizationComponent } from './surt06/surt06-organization.component';

const routes: Routes = [
  {
    path: '',
    canActivate: [AuthorizationGuard],
    canActivateChild: [AuthorizationGuard],
    children: [
      {
        path: 'surt01',
        component: Surt01Component,
        resolve: {
          surt01: Surt01Resolver
        },
        data: {
          code: Surt01Component.programCode
        }
      }, {
        path: 'surt01/detail',
        component: Surt01DetailComponent,
        resolve: {
          surt01: Surt01Resolver
        },
        data: {
          code: Surt01Component.programCode
        },
        canDeactivate: [CanDeactivateGuard],
        runGuardsAndResolvers: 'always'
      }, {
        path: 'surt02',
        component: Surt02Component,
        resolve: {
          surt02: Surt02Resolver
        },
        data: {
          code: Surt02Component.programCode
        }
      }, {
        path: 'surt02/detail',
        component: Surt02DetailComponent,
        resolve: {
          surt02: Surt02Resolver
        },
        data: {
          code: Surt02Component.programCode
        },
        canDeactivate: [CanDeactivateGuard],
        runGuardsAndResolvers: 'always'
      }, {
        path: 'surt03',
        component: Surt03Component,
        resolve: {
          surt03: Surt03Resolver
        },
        data: {
          code: Surt03Component.programCode
        }
      }, {
        path: 'surt03/detail',
        component: Surt03DetailComponent,
        resolve: {
          surt03: Surt03Resolver
        },
        data: {
          code: Surt03Component.programCode
        },
        canDeactivate: [CanDeactivateGuard],
        runGuardsAndResolvers: 'always'
      }, {
        path: 'surt04',
        component: Surt04Component,
        resolve: {
          surt04: Surt04Resolver
        },
        data: {
          code: Surt04Component.programCode
        },
        canDeactivate: [CanDeactivateGuard]
      }, {
        path: 'surt04/detail',
        component: Surt04DetailComponent,
        resolve: {
          surt04: Surt04Resolver
        },
        data: {
          code: Surt04Component.programCode
        },
        canDeactivate: [CanDeactivateGuard],
        runGuardsAndResolvers: 'always'
      }, {
        path: 'surt06',
        component: Surt06Component,
        resolve: {
          surt06: Surt06Resolver
        },
        data: {
          code: Surt06Component.programCode
        },
        canDeactivate: [CanDeactivateGuard]
      }, {
        path: 'surt06/detail',
        component: Surt06DetailComponent,
        resolve: {
          surt06: Surt06Resolver
        },
        data: {
          code: Surt06Component.programCode
        },
        canDeactivate: [CanDeactivateGuard],
        runGuardsAndResolvers: 'always'
      }, {
        path: 'surt06/organization',
        component: Surt06OrganizationComponent,
        resolve: {
          surt06: Surt06Resolver
        },
        data: {
          code: Surt06Component.programCode
        },
        canDeactivate: [CanDeactivateGuard],
        runGuardsAndResolvers: 'always'
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [
    Surt01Resolver,
    Surt02Resolver,
    Surt03Resolver,
    Surt04Resolver,
    Surt06Resolver
  ]

})
export class SuRoutingModule { }
