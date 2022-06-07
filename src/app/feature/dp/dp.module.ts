import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DpRoutingModule } from './dp-routing.module';
import { SharedModule } from '@app/shared';
import { ReactiveFormsModule } from '@angular/forms';
import { LazyTranslationService } from '@app/core';
import { Dprt01Component } from './dprt01/dprt01.component';
import { Dprt01DetailComponent } from './dprt01/dprt01-detail.component';
import { Dprt01GuideDetailComponent } from './dprt01/dprt01-guide-detail.component';
import { Dprt01Service } from './dprt01/dprt01.service';
import { Dprt02Service } from './dprt02/dprt02.service';
import { Dprt02DetailComponent } from './dprt02/dprt02-detail.component';
import { Dprt02Component } from './dprt02/dprt02.component';
import { Dpdt01Component } from './dpdt01/dpdt01.component';
import { Dpdt01Service } from './dpdt01/dpdt01.service';
import { Dpdt01DetailComponent } from './dpdt01/dpdt01-detail.component';
import { Dpdt02Component } from './dpdt02/dpdt02.component';
import { Dpdt02Service } from './dpdt02/dpdt02.service';
import { Dpdt02DetailComponent } from './dpdt02/dpdt02-detail.component';

@NgModule({
  declarations: [
    Dprt01Component,
    Dprt01DetailComponent,
    Dprt01GuideDetailComponent,
    Dprt02Component,
    Dprt02DetailComponent,
    Dpdt01Component,
    Dpdt01DetailComponent,
    Dpdt02Component,
    Dpdt02DetailComponent
  ],
  imports: [
    CommonModule,
    DpRoutingModule,
    ReactiveFormsModule,
    SharedModule,
  ],
  providers: [
    Dprt01Service,
    Dprt02Service,
    Dpdt01Service,
    Dpdt02Service
  ],
  entryComponents: []
})
export class DpModule {
  constructor(private lazy: LazyTranslationService) {
    lazy.add('dp');
  }
}
