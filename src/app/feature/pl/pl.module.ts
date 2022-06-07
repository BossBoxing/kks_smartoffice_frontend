import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PlRoutingModule } from './pl-routing.module';
import { SharedModule } from '@app/shared';
import { LazyTranslationService } from '@app/core';
import { ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { Plrt01DetailComponent } from './plrt01/plrt01-detail/plrt01-detail.component';
import { Plrt01Component } from './plrt01/plrt01.component';
import { Plrt01Service } from './plrt01/plrt01.service';
import { Plrt02DetailComponent } from './plrt02/plrt02-detail.component';
import { Plrt02Component } from './plrt02/plrt02.component';
import { Plrt02Service } from './plrt02/plrt02.service';
import { Plrt03DetailComponent } from './plrt03/plrt03-detail/plrt03-detail.component';
import { Plrt03LookupComponent } from './plrt03/plrt03-lookup/plrt03-lookup.component';
import { Plrt03Component } from './plrt03/plrt03.component';
import { Plrt03Service } from './plrt03/plrt03.service';
import { Pldt01Service } from './pldt01/pldt01.service';
import { Pldt01Component } from './pldt01/pldt01.component';
import { Pldt01ModalComponent } from './pldt01/pldt01-modal.component';
import { Plrp01Component } from './plrp01/plrp01.component';
import { Plrp01Service } from './plrp01/plrp01.service';
@NgModule({
  declarations: [
    Plrt01Component,
    Plrt01DetailComponent,
    Plrt02Component,
    Plrt02DetailComponent,
    Plrt03Component,
    Plrt03DetailComponent,
    Plrt03LookupComponent,
    Pldt01Component,
    Pldt01ModalComponent,
    Plrp01Component
  ],
  imports: [
    CommonModule,
    NgbModule,
    PlRoutingModule,
    ReactiveFormsModule,
    SharedModule
  ],
  providers: [
    Plrt01Service,
    Plrt02Service,
    Plrt03Service,
    Pldt01Service,
    Plrp01Service
  ],
  entryComponents: [
    Pldt01ModalComponent,
    Plrt03LookupComponent
  ]
})
export class PlModule {
  constructor(private lazy: LazyTranslationService) {
    lazy.add('pl');
  }
}
