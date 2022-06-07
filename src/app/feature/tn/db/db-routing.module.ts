import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CanDeactivateGuard, AuthorizationGuard } from '@app/core';
import { Tndbrt03DetailComponent } from './tndbrt03/tndbrt03-detail/tndbrt03-detail.component';
import { Tndbrt03Resolver } from './tndbrt03/tndbrt03-resolver.service';
import { Tndbrt03Component } from './tndbrt03/tndbrt03.component';
import { Tndbrt05DetailComponent } from './tndbrt05/tndbrt05-detail/tndbrt05-detail.component';
import { Tndbrt05Resolver } from './tndbrt05/tndbrt05-resolver.service';
import { Tndbrt05Component } from './tndbrt05/tndbrt05.component';
import { Tndbrt10DetailComponent } from './tndbrt10/tndbrt10-detail/tndbrt10-detail.component';
import { Tndbrt10Resolver } from './tndbrt10/tndbrt10-resolver.service';
import { Tndbrt10Component } from './tndbrt10/tndbrt10.component';


const routes: Routes = [
  {
    path: '',
    canActivate: [AuthorizationGuard],
    canActivateChild: [AuthorizationGuard],
    children: [
      {
        path: 'dbrt03',
        component: Tndbrt03Component,
        resolve: {
          dbrt03: Tndbrt03Resolver
        },
        data: {
          code: Tndbrt03Component.programCode
        }
      }, {
        path: 'dbrt03/detail',
        component: Tndbrt03DetailComponent,
        resolve: {
          dbrt03: Tndbrt03Resolver
        },
        data: {
          code: Tndbrt03Component.programCode
        },
        canDeactivate: [CanDeactivateGuard],
        runGuardsAndResolvers: 'always'
      }, {
        path: 'dbrt05',
        component: Tndbrt05Component
      }, {
        path: 'dbrt05/detail',
        component: Tndbrt05DetailComponent,
        resolve: {
          dbrt05: Tndbrt05Resolver
        },
        data: {
          code: Tndbrt05Component.programCode
        },
        canDeactivate: [CanDeactivateGuard],
        runGuardsAndResolvers: 'always'
      }, {
        path: 'dbrt10',
        component: Tndbrt10Component,
        resolve: {
          dbrt10: Tndbrt10Resolver
        },
        data: {
          code: Tndbrt10Component.programCode
        }
      }, {
        path: 'dbrt10/detail',
        component: Tndbrt10DetailComponent,
        resolve: {
          dbrt10: Tndbrt10Resolver
        },
        data: {
          code: Tndbrt10Component.programCode
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
    Tndbrt03Resolver,
    Tndbrt05Resolver,
    Tndbrt10Resolver
  ]
})
export class DbRoutingModule { }
