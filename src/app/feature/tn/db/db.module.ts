import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DbRoutingModule } from './db-routing.module';
import { SharedModule } from '@app/shared';
import { ReactiveFormsModule } from '@angular/forms';
import { LazyTranslationService } from '@app/core';
import { Tndbrt03DetailComponent } from './tndbrt03/tndbrt03-detail/tndbrt03-detail.component';
import { Tndbrt03Component } from './tndbrt03/tndbrt03.component';
import { Tndbrt03Service } from './tndbrt03/tndbrt03.service';
import { Tndbrt05Component } from './tndbrt05/tndbrt05.component';
import { Tndbrt05Service } from './tndbrt05/tndbrt05.service';
import { Tndbrt10DetailComponent } from './tndbrt10/tndbrt10-detail/tndbrt10-detail.component';
import { Tndbrt10Component } from './tndbrt10/tndbrt10.component';
import { Tndbrt10Service } from './tndbrt10/tndbrt10.service';
import { Tndbrt05DetailComponent } from './tndbrt05/tndbrt05-detail/tndbrt05-detail.component';

@NgModule({
  declarations: [
    Tndbrt03Component,
    Tndbrt03DetailComponent,
    Tndbrt05Component,
    Tndbrt05DetailComponent,
    Tndbrt10Component,
    Tndbrt10DetailComponent
  ],
  imports: [
    CommonModule,
    DbRoutingModule,
    ReactiveFormsModule,
    SharedModule,
  ],
  providers: [
    Tndbrt03Service,
    Tndbrt05Service,
    Tndbrt10Service],
  entryComponents: []
})
export class DbModule {
  constructor(private lazy: LazyTranslationService) {
    lazy.add('db');
  }
}
