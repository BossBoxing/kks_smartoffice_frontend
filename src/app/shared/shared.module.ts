import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgOptionHighlightModule } from '@ng-select/ng-option-highlight';
import { ModalModule } from 'ngx-bootstrap/modal';
import { MAT_DATE_FORMATS, DateAdapter } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { CollapseModule } from 'ngx-bootstrap/collapse';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { CardComponent } from './component/card/card.component';
import { NgxDatatableModule } from 'ss-group-datatable';
import { TableComponent } from './component/datatable/table/table.component';
import { TableClientComponent } from './component/datatable/table-client/table-client.component';
import { TableGroupComponent } from './component/datatable/table-group/table-group.component';
import { ThaiDatePipe } from './pipe/thaidate.pipe';
import { ThaiDateTimePipe } from './pipe/thaidateTime.pipe';
import { CheckboxComponent } from './component/checkbox/checkbox.component';
import { TextboxComponent } from './component/textbox/textbox.component';
import { RadioComponent } from './component/radio/radio.component';
import { RadioButtonComponent } from './component/radio/radio-button.component';
import { SelectComponent } from './component/select/select.component';
import { LookupComponent } from './component/lookup/lookup.component';
import { SearchComponent } from './component/search/search.component';
import { NumberComponent } from './component/number/number.component';
import { ToolbarComponent } from './component/toolbar/toolbar.component';
import { ModalComponent } from './component/modal/modal.component';
import { ConfirmComponent } from './component/modal/confirm/confirm.component';
import { ModalService } from './component/modal/modal.service';
import { DatepickerComponent } from './component/datepicker/datepicker.component';
import { AppDateAdapter, APP_DATE_FORMATS } from './component/datepicker/date.adaptor';
import { AreaComponent } from './component/area/area.component';
import { ImageComponent } from './component/attachment/image.component';
import { AttachmentComponent } from './component/attachment/attachment.component';
import { DragDropDirective } from './component/attachment/drag-drop.directive';
import { CurrencyComponent } from './component/number/currency.component';
import { FormUtilService } from './service/form-util.service';
import { YearComponent } from './component/year/year.component';
import { StatusComponent } from './component/status/status.component';
import { RadioCheckboxComponent } from './component/radio/radio-checkbox.component';
import { TranslateModule } from '@ngx-translate/core';
import { CalendarModule, DateAdapter as CalendarDateAdapter } from './component/calendar/calendar.module';
import { adapterFactory } from './component/calendar/date-adapters/date-fns';
import { TimeComponent } from './component/time/time.component';
import { AutoCompleteComponent } from './component/auto-complete/auto-complete.component';
import { BaseLookupComponent } from './component/lookup/base-lookup.component';
import { BaseLookupMultipleComponent } from './component/lookup/base-lookup-multiple.component';
import { CheckButtonComponent } from './component/checkbox/check-button.component';
import { NgxExtendedPdfViewerModule } from 'ngx-extended-pdf-viewer';
import { ImportComponent } from './component/import/import.component';
import { DatePipe } from '@angular/common';
import { AttachmentUrlComponent } from './component/attachment-url/attachment-url.component';
import { ReportViewerComponent } from './component/report-viewer/report-viewer.component';
import { DateTimeViewerComponent } from './component/datetime-viewer/datetime-viewer.component';
import { NumberUtilService } from './service/number-util.service';
import { FullCalendarModule } from '@fullcalendar/angular';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import bootstrapPlugin from '@fullcalendar/bootstrap';

FullCalendarModule.registerPlugins([
  dayGridPlugin,
  interactionPlugin,
  timeGridPlugin,
  listPlugin,
  bootstrapPlugin
]);
@NgModule({
  declarations: [
    CardComponent,
    TableComponent,
    TableClientComponent,
    TableGroupComponent,
    ThaiDatePipe,
    ThaiDateTimePipe,
    CheckboxComponent,
    TextboxComponent,
    RadioComponent,
    RadioButtonComponent,
    SelectComponent,
    LookupComponent,
    SearchComponent,
    NumberComponent,
    ToolbarComponent,
    ModalComponent,
    ConfirmComponent,
    DatepickerComponent,
    AreaComponent,
    ImageComponent,
    AttachmentComponent,
    DragDropDirective,
    CurrencyComponent,
    YearComponent,
    StatusComponent,
    RadioCheckboxComponent,
    TimeComponent,
    AutoCompleteComponent,
    BaseLookupComponent,
    BaseLookupMultipleComponent,
    CheckButtonComponent,
    ImportComponent,
    AttachmentUrlComponent,
    ReportViewerComponent,
    DateTimeViewerComponent
  ],
  imports: [
    CommonModule,
    ModalModule.forRoot(),
    CollapseModule.forRoot(),
    TabsModule.forRoot(),
    NgxDatatableModule,
    FormsModule,
    NgSelectModule,
    NgOptionHighlightModule,
    ReactiveFormsModule,
    MatDatepickerModule,
    MatMenuModule,
    MatIconModule,
    MatButtonModule,
    TooltipModule.forRoot(),
    TranslateModule,
    FullCalendarModule,
    CalendarModule.forRoot({
      provide: CalendarDateAdapter,
      useFactory: adapterFactory
    }),
    NgxExtendedPdfViewerModule
  ],
  entryComponents: [ConfirmComponent],
  exports: [
    ModalModule,
    NgSelectModule,
    NgOptionHighlightModule,
    CollapseModule,
    TabsModule,
    CardComponent,
    NgxDatatableModule,
    TooltipModule,
    MatMenuModule,
    MatIconModule,
    MatButtonModule,
    FullCalendarModule,
    TableComponent,
    TableClientComponent,
    TableGroupComponent,
    ThaiDatePipe, ThaiDateTimePipe,
    CheckboxComponent,
    RadioComponent,
    RadioButtonComponent,
    TextboxComponent,
    DatepickerComponent,
    TimeComponent,
    NumberComponent,
    YearComponent,
    CurrencyComponent,
    LookupComponent,
    AutoCompleteComponent,
    SelectComponent,
    SearchComponent,
    ToolbarComponent,
    ModalComponent,
    ConfirmComponent,
    AreaComponent,
    AttachmentComponent,
    ImageComponent,
    StatusComponent,
    RadioCheckboxComponent,
    CheckButtonComponent,
    TranslateModule,
    CalendarModule,
    NgxExtendedPdfViewerModule,
    ImportComponent,
    AttachmentUrlComponent,
    ReportViewerComponent,
    DateTimeViewerComponent
  ],
  providers: [
    ModalService,
    FormUtilService,
    NumberUtilService,
    { provide: DateAdapter, useClass: AppDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: APP_DATE_FORMATS },
    DatePipe,
    ThaiDatePipe,
    ThaiDateTimePipe
  ]
})
export class SharedModule { }
