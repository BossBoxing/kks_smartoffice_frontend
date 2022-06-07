import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DashboardComponent } from './dashboard.component';
import { AuthorizationGuard } from '@app/core';
import { DashboardResolver } from './dashboard-resolver.service';

const routes: Routes = [
  {
    path: '',
    canActivate: [AuthorizationGuard],
    component : DashboardComponent,
    resolve: {
      dashboard: DashboardResolver
    },
    data: {
      code: DashboardComponent.programCode
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [DashboardResolver]
})
export class DashboardRoutingModule { }
