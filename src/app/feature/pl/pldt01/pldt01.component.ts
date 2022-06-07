import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CalendarOptions } from '@fullcalendar/angular';
import { Pldt01Service, PlTaskEntry } from './pldt01.service';
import { Pldt01ModalComponent } from './pldt01-modal.component';
import { forkJoin, of } from 'rxjs';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { FormUtilService, ModalService, Size } from '@app/shared';
import { MessageService } from '@app/core';
import { MatMenuTrigger } from '@angular/material/menu';
import { Validators, FormGroup, FormBuilder } from '@angular/forms';
import { finalize, map } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';

@Component({
    selector: 'app-pldt01',
    templateUrl: './pldt01.component.html',
    styleUrls: ['./pldt01.component.scss']
})
export class Pldt01Component implements OnInit {
    public static readonly programCode = 'pldt01';
    @ViewChild(MatMenuTrigger) contextMenu: MatMenuTrigger;
    taskModal = Pldt01ModalComponent;
    calendarOptions: CalendarOptions;
    copyModal: BsModalRef;
    plTaskEntryForm: FormGroup;
    taskEntryList: [];
    masterData = { workTypes: [], progStatusCodes: [] };
    userInfo: any;
    contextMenuPosition = { x: '0px', y: '0px' };
    buttonLabels = {
        today: null
        , week: null
        , month: null
        , day: null
        , list: null
        , excludeWeekend: null
        , includeWeekend: null
    };
    saving = false;

    constructor(
        private route: ActivatedRoute,
        private modal: BsModalService,
        private modalConfirm: ModalService,
        private translate: TranslateService,
        public util: FormUtilService,
        private ms: MessageService,
        private fb: FormBuilder,
        private pl: Pldt01Service
    ) { }

    ngOnInit(): void {
        this.createCopyForm();
        forkJoin([
            this.translate.get('label.PLDT01.Day')
            , this.translate.get('label.PLDT01.Today')
            , this.translate.get('label.PLDT01.Week')
            , this.translate.get('label.PLDT01.Month')
            , this.translate.get('label.PLDT01.List')
            , this.translate.get('label.PLDT01.ExcludeWeekend')
            , this.translate.get('label.PLDT01.IncludeWeekend')
        ]).pipe(map(result => {
            this.buttonLabels.day = result[0];
            this.buttonLabels.today = result[1];
            this.buttonLabels.week = result[2];
            this.buttonLabels.month = result[3];
            this.buttonLabels.list = result[4];
            this.buttonLabels.excludeWeekend = result[5];
            this.buttonLabels.includeWeekend = result[6];
        })).subscribe();
        this.route.data.subscribe((data) => {
            this.taskEntryList = data.pldt01.detail;
            this.initialMasterData(data);
            this.initialCalendar();
        });
        this.installEvent();
    }

    initialMasterData(data) {
        this.masterData = data.pldt01.master;
        this.userInfo = data.pldt01.master.userInfo;
    }

    initialCalendar() {
        this.calendarOptions = {
            initialView: 'dayGridMonth',
            timeZone: 'UTC+7',
            contentHeight: 550,
            weekends: true,
            editable: true, // drag event
            navLinks: true, // can click day/week names to navigate views
            selectable: false, // highlight multiple days
            eventColor: '#B2A1CD', // primary color,
            titleFormat: { year: 'numeric', month: 'long', day: 'numeric' },
            dayMaxEventRows: true,
            locale: this.userInfo.language.toLowerCase(),
            themeSystem: 'bootstrap', // theme calendar
            views: { dayGridMonth: { dayMaxEventRows: 3, dayMaxEvents: 3 } },
            buttonText: {
                today: this.buttonLabels.today
                , month: this.buttonLabels.month
                , week: this.buttonLabels.week
                , day: this.buttonLabels.day
                , list: this.buttonLabels.list
            },
            businessHours: {
                daysOfWeek: [1, 2, 3, 4, 5], // Monday - Friday
                startTime: '08:30', // a start time (08:30am)
                endTime: '17:30', // an end time (05:30pm)
            },
            customButtons: { btnWeekend: { text: this.buttonLabels.excludeWeekend, click: this.toggleWeekends.bind(this) } },
            headerToolbar: {
                left: 'prev,next today',
                center: 'title',
                right: 'btnWeekend dayGridMonth,timeGridWeek,timeGridDay,listMonth'
            },
            eventDidMount: (info) => {
                info.el.id = info.event.id;
                info.el.style.cursor = 'pointer';
                info.el.ondblclick = () => { // double click on task
                    this.handleTaskEntry(info.event.extendedProps);
                };
                info.el.oncontextmenu = (event: MouseEvent) => { // right click on task
                    this.openContextMenu(event, info.event.extendedProps);
                };
            },
            dayCellDidMount: (info) => {
                info.el.oncontextmenu = (event: MouseEvent) => { // right click on calendar
                    this.openContextMenu(event, { workDate: info.date });
                };
            },
            events: this.taskEntryList
        };
    }

    toggleWeekends() {
        this.calendarOptions.weekends = !this.calendarOptions.weekends;
        const buttonText = (this.calendarOptions.weekends) ? this.buttonLabels.excludeWeekend : this.buttonLabels.includeWeekend;
        this.calendarOptions.customButtons = { btnWeekend: { text: buttonText, click: this.toggleWeekends.bind(this) } };
    }

    openContextMenu(event, data) {
        event.preventDefault();
        this.contextMenuPosition.x = event.x + 'px';
        this.contextMenuPosition.y = event.y + 'px';
        this.contextMenu.menuData = { item: data };
        this.contextMenu.menu.focusFirstItem('mouse');
        this.contextMenu.openMenu();
    }

    openModal(template: TemplateRef<any>, data) {
        this.rebuildCopyForm(data);
        this.copyModal = this.modal.show(template, { animated: true, class: Size.large });
    }

    closeModal() {
        this.plTaskEntryForm.reset();
        this.copyModal.hide();
    }

    createCopyForm() {
        this.plTaskEntryForm = this.fb.group({
            seq: null
            , startWorkDate: [null, [Validators.required]]
            , endWorkDate: [null, [Validators.required]]
            , includeWeekend: false
        });
    }

    rebuildCopyForm(data) {
        this.plTaskEntryForm.markAsPristine();
        if (data.rowVersion) {
            this.plTaskEntryForm.controls.seq.setValue(data.seq, { emitEvent: false });
            this.plTaskEntryForm.controls.startWorkDate.setValue(data.workDate, { emitEvent: false });
            this.plTaskEntryForm.controls.endWorkDate.setValue(data.workDate, { emitEvent: false });
        }
        this.plTaskEntryForm.markAsPristine();
    }

    installEvent() {
        this.plTaskEntryForm.controls.startWorkDate.valueChanges.subscribe((startWorkDate) => {
            if (this.plTaskEntryForm.controls.startWorkDate.dirty) {
                if (startWorkDate > this.plTaskEntryForm.controls.endWorkDate.value) {
                    this.plTaskEntryForm.controls.endWorkDate.setValue(startWorkDate, { emitEvent: false });
                }
            }
        });
    }

    findTaskEntryList() {
        this.pl.findPlTaskEntrys().subscribe(response => {
            this.taskEntryList = response;
            this.initialCalendar();
        });
    }

    handleTaskEntry(data): Promise<boolean> {
        const initialState = { masterData: this.masterData, plTaskEntry: data || of({} as PlTaskEntry) };
        const modalRef = this.modal.show(this.taskModal, { animated: true, class: Size.xlarge, focus: true, initialState });
        return new Promise<boolean>(() => modalRef.content.result.subscribe((result) => {
            if (result) { this.findTaskEntryList(); }
        }));
    }

    copyTaskEntry() {
        if (this.util.isFormGroupValid(this.plTaskEntryForm)) {
            this.saving = true;
            this.pl.copy(this.plTaskEntryForm.value).pipe(finalize(() => this.saving = false)).subscribe(() => {
                this.ms.success('message.STD00006');
                this.copyModal.hide();
                this.findTaskEntryList();
            });
        }
    }

    removeTaskEntry(data) {
        this.modalConfirm.confirm('message.STD00003').subscribe((res) => {
            if (res && data) {
                this.pl.delete(data.seq, data.rowVersion).subscribe(() => {
                    this.ms.success('message.STD00014');
                    this.findTaskEntryList();
                });
            }
        });
    }

    rightClick(event: MouseEvent) {
        event.preventDefault();
    }
}
