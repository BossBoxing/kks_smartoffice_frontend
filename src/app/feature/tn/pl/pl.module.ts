import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PlRoutingModule } from './pl-routing.module';
import { SharedModule } from '@app/shared';
import { LazyTranslationService } from '@app/core';
import { Plrt02Component } from './plrt02/plrt02.component';
import { Plrt02DetailComponent } from './plrt02/plrt02-detail.component';
import { Plrt02Service } from './plrt02/plrt02.service';
import { Plrt03Component } from './plrt03/plrt03.component';
import { Plrt03DetailComponent } from './plrt03/plrt03-detail/plrt03-detail.component';
import { Plrt03Service } from './service/plrt03.service';
import { Plrt03LookupComponent } from './plrt03/plrt03-lookup/plrt03-lookup.component';
import { ReactiveFormsModule } from '@angular/forms';
import { Plrt01DetailComponent } from './plrt01/plrt01-detail/plrt01-detail.component';
import { Plrt01Component } from './plrt01/plrt01.component';
import { Plrt01Service } from './plrt01/plrt01.service';

@NgModule({
  declarations: [
    Plrt01Component,
    Plrt01DetailComponent,
    Plrt02Component,
    Plrt02DetailComponent,
    Plrt03Component,
    Plrt03DetailComponent,
    Plrt03LookupComponent
  ],
  imports: [
    CommonModule,
    PlRoutingModule,
    ReactiveFormsModule,
    SharedModule
  ],
  providers: [
    Plrt01Service,
    Plrt02Service,
    Plrt03Service
  ],
  entryComponents: []
})
export class PlModule {
  constructor(private lazy: LazyTranslationService) {
    lazy.add('pl');
  }
}
