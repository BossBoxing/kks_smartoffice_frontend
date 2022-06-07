import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CanDeactivateGuard, AuthorizationGuard } from '@app/core';
import { Tndt01DetailComponent } from './tndt01/tndt01-detail/tndt01-detail.component';
import { Tndt01Resolver } from './tndt01/tndt01-resolver.service';
import { Tndt01Component } from './tndt01/tndt01.component';


const routes: Routes = [
  {
    path: '',
    canActivate: [AuthorizationGuard],
    canActivateChild: [AuthorizationGuard],
    children: [
      {
        path: 'tndt01',
        component: Tndt01Component,
        resolve: {
          tndt01: Tndt01Resolver
        },
        data: {
          code: Tndt01Component.programCode
        }
      },
      {
        path: 'tndt01/detail',
        component: Tndt01DetailComponent,
        resolve: {
          tndt01: Tndt01Resolver
        },
        data: {
          code: Tndt01Component.programCode
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
    Tndt01Resolver
  ]
})
export class TnRoutingModule { }
