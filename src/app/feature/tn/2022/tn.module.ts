import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TnRoutingModule } from './tn-routing.module';
import { SharedModule } from '@app/shared';
import { ReactiveFormsModule } from '@angular/forms';
import { LazyTranslationService } from '@app/core';
import { Tndt01Component } from './tndt01/tndt01.component';
import { Tndt01Service } from './tndt01/tndt01.service';
import { Tndt01DetailComponent } from './tndt01/tndt01-detail/tndt01-detail.component';

@NgModule({
  declarations: [
    Tndt01Component,
    Tndt01DetailComponent
  ],
  imports: [
    CommonModule,
    TnRoutingModule,
    ReactiveFormsModule,
    SharedModule,
  ],
  providers: [
    Tndt01Service
  ],
  entryComponents: []
})
export class TnModule {
  constructor(private lazy: LazyTranslationService) {
    lazy.add('tn');
  }
}
