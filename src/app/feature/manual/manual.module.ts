import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '@app/shared';
import { ManualComponent } from './manual.component';
import { ManualRoutingModule } from './manual-routing.module';

@NgModule({
  declarations: [ManualComponent],
  imports: [
    CommonModule,
    ManualRoutingModule,
    SharedModule,
    ReactiveFormsModule 
  ],
  providers:[
  ]
})
export class ManualModule { }
