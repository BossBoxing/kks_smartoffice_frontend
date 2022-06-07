import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DbRoutingModule } from './db-routing.module';
import { SharedModule } from '@app/shared';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { LazyTranslationService } from '@app/core';
import { Dbrt03Component } from './dbrt03/dbrt03.component';
import { Dbrt03DetailComponent } from './dbrt03/dbrt03-detail.component';
import { Dbrt03Service } from './dbrt03/dbrt03.service';
import { Dbrt04DetailComponent } from './dbrt04/dbrt04-detail.component';
import { Dbrt04Component } from './dbrt04/dbrt04.component';
import { Dbrt04Service } from './dbrt04/dbrt04.service';
import { Dbrt05Component } from './dbrt05/dbrt05.component';
import { Dbrt05DetailComponent } from './dbrt05/dbrt05-detail.component';
import { Dbrt05Service } from './dbrt05/dbrt05.service';
import { Dbrt07Component } from './dbrt07/dbrt07.component';
import { Dbrt07DetailComponent } from './dbrt07/dbrt07-detail.component';
import { Dbrt07Service } from './dbrt07/dbrt07.service';
import { Dbrt08Component } from './dbrt08/dbrt08.component';
import { Dbrt08DetailComponent } from './dbrt08/dbrt08-detail.component';
import { Dbrt08Service } from './dbrt08/dbrt08.service';
import { Dbrt09Component } from './dbrt09/dbrt09.component';
import { Dbrt09DetailComponent } from './dbrt09/dbrt09-detail.component';
import { Dbrt09Service } from './dbrt09/dbrt09.service';
import { Dbrt10Component } from './dbrt10/dbrt10.component';
import { Dbrt10DetailComponent } from './dbrt10/dbrt10-detail.component';
import { Dbrt10Service } from './dbrt10/dbrt10.service';
import { Dbrt11Component } from './dbrt11/dbrt11.component';
import { Dbrt11DetailComponent } from './dbrt11/dbrt11-detail.component';
import { Dbrt11Service } from './dbrt11/dbrt11.service';

@NgModule({
  declarations: [
    Dbrt03Component,
    Dbrt03DetailComponent,
    Dbrt04Component,
    Dbrt04DetailComponent,
    Dbrt05Component,
    Dbrt05DetailComponent,
    Dbrt07Component,
    Dbrt07DetailComponent,
    Dbrt08Component,
    Dbrt08DetailComponent,
    Dbrt09Component,
    Dbrt09DetailComponent,
    Dbrt10Component,
    Dbrt10DetailComponent,
    Dbrt11Component,
    Dbrt11DetailComponent
  ],
  imports: [
    CommonModule,
    DbRoutingModule,
    SharedModule,
    ReactiveFormsModule,
    FormsModule
  ],
  providers: [
    Dbrt03Service,
    Dbrt04Service,
    Dbrt05Service,
    Dbrt07Service,
    Dbrt08Service,
    Dbrt09Service,
    Dbrt10Service,
    Dbrt11Service
  ]
})
export class DbModule {
  constructor(private lazy: LazyTranslationService) {
    lazy.add('db');
  }
}
