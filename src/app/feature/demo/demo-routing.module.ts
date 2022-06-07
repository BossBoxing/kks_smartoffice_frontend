import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LayoutComponent } from './layout/layout.component';
import { InputComponent } from './input/input.component';
import { DatatableComponent } from './datatable/datatable.component';
import { InputDatatableComponent } from './datatable/input-datatable.component';
import { InputLookupComponent } from './datatable/input-lookup.component';
import { ReportComponent } from './report/report.component';
import { AuthorizationGuard } from '@app/core';
import { ReportSsruComponent } from './reportssru/reportssru.component';
import { ReportFincComponent } from './reportfinc/reportfinc.component';

const routes: Routes = [
  {
    path: '',
    canActivate:[AuthorizationGuard],
    canActivateChild:[AuthorizationGuard],
    children:[
      { path:'layout',component:LayoutComponent},
      { path:'input',component:InputComponent},
      { path:'datatable',component:DatatableComponent},
      { path:'input-datatable',component:InputDatatableComponent},
      { path:'input-lookup',component:InputLookupComponent},
      { path:'report',component:ReportComponent},
      { path:'reportssru',component:ReportSsruComponent},
      { path:'reportfinc',component:ReportFincComponent}
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DemoRoutingModule { }
