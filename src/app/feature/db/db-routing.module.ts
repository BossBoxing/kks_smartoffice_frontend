import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { Dbrt03DetailComponent } from './dbrt03/dbrt03-detail.component';
import { Dbrt03Resolver } from './dbrt03/dbrt03-resolver.service';
import { Dbrt03Component } from './dbrt03/dbrt03.component';
import { Dbrt04DetailComponent } from './dbrt04/dbrt04-detail.component';
import { Dbrt04Resolver } from './dbrt04/dbrt04-resolver.service';
import { Dbrt04Component } from './dbrt04/dbrt04.component';
import { Dbrt05Component } from './dbrt05/dbrt05.component';
import { Dbrt05Resolver } from './dbrt05/dbrt05-resolver.service';
import { Dbrt05DetailComponent } from './dbrt05/dbrt05-detail.component';
import { Dbrt07Component } from './dbrt07/dbrt07.component';
import { Dbrt07Resolver } from './dbrt07/dbrt07-resolver.service';
import { Dbrt07DetailComponent } from './dbrt07/dbrt07-detail.component';
import { Dbrt08Component } from './dbrt08/dbrt08.component';
import { Dbrt08Resolver } from './dbrt08/dbrt08-resolver.service';
import { Dbrt08DetailComponent } from './dbrt08/dbrt08-detail.component';
import { Dbrt09Component } from './dbrt09/dbrt09.component';
import { Dbrt09Resolver } from './dbrt09/dbrt09-resolver.service';
import { Dbrt09DetailComponent } from './dbrt09/dbrt09-detail.component';
import { Dbrt10Component } from './dbrt10/dbrt10.component';
import { Dbrt10Resolver } from './dbrt10/dbrt10-resolver.service';
import { Dbrt10DetailComponent } from './dbrt10/dbrt10-detail.component';
import { Dbrt11Component } from './dbrt11/dbrt11.component';
import { Dbrt11DetailComponent } from './dbrt11/dbrt11-detail.component';
import { Dbrt11Resolver } from './dbrt11/dbrt11-resolver.service';
import { AuthorizationGuard, CanDeactivateGuard } from '@app/core';

const routes: Routes = [
  {
    path: '',
    canActivate: [AuthorizationGuard],
    canActivateChild: [AuthorizationGuard],
    children: [
      {
        path: 'dbrt03',
        component: Dbrt03Component,
        resolve: {
          dbrt03: Dbrt03Resolver
        },
        data: {
          code: Dbrt03Component.programCode
        }
      }, {
        path: 'dbrt03/detail',
        component: Dbrt03DetailComponent,
        resolve: {
          dbrt03: Dbrt03Resolver
        },
        data: {
          code: Dbrt03Component.programCode
        },
        canDeactivate: [CanDeactivateGuard],
        runGuardsAndResolvers: 'always'
      }, {
        path: 'dbrt04',
        component: Dbrt04Component,
        resolve: {
          dbrt04: Dbrt04Resolver
        },
        data: {
          code: Dbrt04Component.programCode
        }
      }, {
        path: 'dbrt04/detail',
        component: Dbrt04DetailComponent,
        resolve: {
          dbrt04: Dbrt04Resolver
        },
        data: {
          code: Dbrt04Component.programCode
        },
        canDeactivate: [CanDeactivateGuard],
        runGuardsAndResolvers: 'always'
      }, {
        path: 'dbrt05',
        component: Dbrt05Component,
        resolve: {
          dbrt05: Dbrt05Resolver
        },
        data: {
          code: Dbrt05Component.programCode
        }
      }, {
        path: 'dbrt05/detail',
        component: Dbrt05DetailComponent,
        resolve: {
          dbrt05: Dbrt05Resolver
        },
        data: {
          code: Dbrt05Component.programCode
        },
        canDeactivate: [CanDeactivateGuard],
        runGuardsAndResolvers: 'always'
      }, {
        path: 'dbrt07',
        component: Dbrt07Component,
        resolve: {
          dbrt07: Dbrt07Resolver
        },
        data: {
          code: Dbrt07Component.programCode
        },
        canDeactivate: [CanDeactivateGuard],
        runGuardsAndResolvers: 'always'
      }, {
        path: 'dbrt07/detail',
        component: Dbrt07DetailComponent,
        resolve: {
          dbrt07: Dbrt07Resolver
        },
        data: {
          code: Dbrt07Component.programCode
        },
        canDeactivate: [CanDeactivateGuard],
        runGuardsAndResolvers: 'always'
      }, {
        path: 'dbrt08',
        component: Dbrt08Component,
        resolve: {
          dbrt08: Dbrt08Resolver
        },
        data: {
          code: Dbrt08Component.programCode
        },
        canDeactivate: [CanDeactivateGuard],
        runGuardsAndResolvers: 'always'
      }, {
        path: 'dbrt08/detail',
        component: Dbrt08DetailComponent,
        resolve: {
          dbrt08: Dbrt08Resolver
        },
        data: {
          code: Dbrt08Component.programCode
        },
        canDeactivate: [CanDeactivateGuard],
        runGuardsAndResolvers: 'always'
      }, {
        path: 'dbrt09',
        component: Dbrt09Component,
        resolve: {
          dbrt09: Dbrt09Resolver
        },
        data: {
          code: Dbrt09Component.programCode
        },
        canDeactivate: [CanDeactivateGuard],
        runGuardsAndResolvers: 'always'
      }, {
        path: 'dbrt09/detail',
        component: Dbrt09DetailComponent,
        resolve: {
          dbrt09: Dbrt09Resolver
        },
        data: {
          code: Dbrt09Component.programCode
        },
        canDeactivate: [CanDeactivateGuard],
        runGuardsAndResolvers: 'always'
      }, {
        path: 'dbrt10',
        component: Dbrt10Component,
        resolve: {
          dbrt10: Dbrt10Resolver
        },
        data: {
          code: Dbrt10Component.programCode
        },
        canDeactivate: [CanDeactivateGuard],
        runGuardsAndResolvers: 'always'
      }, {
        path: 'dbrt10/detail',
        component: Dbrt10DetailComponent,
        resolve: {
          dbrt10: Dbrt10Resolver
        },
        data: {
          code: Dbrt10Component.programCode
        },
        canDeactivate: [CanDeactivateGuard],
        runGuardsAndResolvers: 'always'
      }, {
        path: 'dbrt11',
        component: Dbrt11Component,
        resolve: {
          dbrt11: Dbrt11Resolver
        },
        data: {
          code: Dbrt11Component.programCode
        },
        canDeactivate: [CanDeactivateGuard],
        runGuardsAndResolvers: 'always'
      }, {
        path: 'dbrt11/detail',
        component: Dbrt11DetailComponent,
        resolve: {
          dbrt11: Dbrt11Resolver
        },
        data: {
          code: Dbrt11Component.programCode
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
    Dbrt03Resolver,
    Dbrt04Resolver,
    Dbrt05Resolver,
    Dbrt07Resolver,
    Dbrt08Resolver,
    Dbrt09Resolver,
    Dbrt10Resolver,
    Dbrt11Resolver
  ]
})
export class DbRoutingModule { }
