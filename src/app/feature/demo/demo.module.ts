import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';

import { DemoRoutingModule } from './demo-routing.module';
import { LayoutComponent} from'./layout/layout.component';
import { SharedModule } from '@app/shared';
import { InputComponent } from './input/input.component';
import { DatatableComponent } from './datatable/datatable.component';
import { DatatableService } from './datatable/datatable.service';
import { InputDatatableComponent } from './datatable/input-datatable.component';
import { LookupDemoComponent } from './input/lookup-demo/lookup-demo.component';
import { LookupDemoService } from './input/lookup-demo/lookup-demo.service';
import { InputLookupComponent } from './datatable/input-lookup.component';
import { LookupMultipleComponent } from './datatable/lookup-multiple/lookup-multiple.component';
import { LookupMultipleService } from './datatable/lookup-multiple/lookup-multiple.service';
import { ReportComponent } from './report/report.component'
import { ReportService } from './report/report.service'
import { ReportSsruComponent } from './reportssru/reportssru.component';
import { ReportFincComponent } from './reportfinc/reportfinc.component';

@NgModule({
  declarations: [LayoutComponent,InputComponent
    , DatatableComponent,InputDatatableComponent
    , LookupDemoComponent, InputLookupComponent
    , LookupMultipleComponent,ReportComponent
    , ReportSsruComponent
    , ReportFincComponent],
  imports: [
    CommonModule,
    DemoRoutingModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule
  ],
  entryComponents:[
    LookupDemoComponent,LookupMultipleComponent
  ],
  providers:[DatatableService,LookupDemoService,LookupMultipleService,ReportService]
})
export class DemoModule { }
