import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SuRoutingModule } from './su-routing.module';
import { SharedModule } from '@app/shared';
import { ReactiveFormsModule } from '@angular/forms';
import { LazyTranslationService } from '@app/core';
import { MatTreeModule } from '@angular/material/tree';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { Surt01Service } from './surt01/surt01.service';
import { Surt01Component } from './surt01/surt01.component';
import { Surt01DetailComponent } from './surt01/surt01-detail.component';
import { Surt02DetailComponent } from './surt02/surt02-detail.component';
import { Surt02Component } from './surt02/surt02.component';
import { Surt02Service } from './surt02/surt02.service';
import { Surt03DetailComponent } from './surt03/surt03-detail.component';
import { Surt03Component } from './surt03/surt03.component';
import { Surt03Service } from './surt03/surt03.service';
import { Surt04Service } from './surt04/surt04.service';
import { Surt04Component } from './surt04/surt04.component';
import { Surt04DetailComponent } from './surt04/surt04-detail.component';
import { Surt04MenuLookupComponent } from './surt04/surt04-menu-lookup/surt04-menu-lookup.component';
import { Surt06DetailComponent } from './surt06/surt06-detail.component';
import { Surt06OrganizationComponent } from './surt06/surt06-organization.component';
import { Surt06Service } from './surt06/surt06.service';
import { DivisionTreeComponent } from './surt06/division-tree/division-tree.component';
import { Surt06Component } from './surt06/surt06.component';

@NgModule({
  declarations: [
    Surt01Component,
    Surt01DetailComponent,
    Surt02Component,
    Surt02DetailComponent,
    Surt03Component,
    Surt03DetailComponent,
    Surt04Component,
    Surt04DetailComponent,
    Surt04MenuLookupComponent,
    Surt06Component,
    Surt06DetailComponent,
    Surt06OrganizationComponent,
    DivisionTreeComponent

  ],
  imports: [
    CommonModule,
    SuRoutingModule,
    ReactiveFormsModule,
    SharedModule,
    MatTreeModule,
    MatButtonModule,
    MatIconModule,
    MatCheckboxModule,
  ],
  providers: [
    Surt01Service,
    Surt02Service,
    Surt03Service,
    Surt04Service,
    Surt06Service

  ],
  entryComponents: [
    Surt04MenuLookupComponent
  ]
})

export class SuModule {
  constructor(private lazy: LazyTranslationService) {
    lazy.add('su');
  }
}
