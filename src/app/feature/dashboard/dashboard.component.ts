import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from '@app/core';
import { FormUtilService, ModalService, Size } from '@app/shared';
import { BsModalRef } from 'ngx-bootstrap';
import { Chart } from 'node_modules/chart.js';
import { switchMap, finalize } from 'rxjs/operators';
import { DashboardService, TaskEntryHistory, TaTimeAttendance } from './dashboard.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  public static readonly programCode = 'dashboard';
  timeAttendancePopup: BsModalRef;
  timeAttendanceForm: FormGroup;
  taTimeAttendance = {} as TaTimeAttendance;
  masterData = {
    taskEntryYears: [],
    notInputSpcDays: 0,
    userInfo: null
  };
  taskEntryChartData = [] as TaskEntryHistory[];
  taskEntryBarChart?: any;

  saving = false;

  constructor(
    private db: DashboardService,
    private router: Router,
    private modal: ModalService,
    private fb: FormBuilder,
    public util: FormUtilService,
    private route: ActivatedRoute,
    private ms: MessageService,
  ) { }

  ngOnInit() {
    this.createForm();
    this.createChart();
    this.installEvent();
    this.route.data.subscribe((data) => {
      this.masterData = data.dashboard.masterData;
      this.taTimeAttendance = data.dashboard.detail;
      this.rebuildForm();
    });
  }

  createForm() {
    this.timeAttendanceForm = this.fb.group({
      checkInReason: [null, [Validators.maxLength(200)]],
      checkOutReason: [null, [Validators.maxLength(200)]],
      taskEntryYear: null
    });
  }

  rebuildForm() {
    this.timeAttendanceForm.markAsPristine();
    this.timeAttendanceForm.patchValue({
      checkInReason: null,
      checkOutReason: null,
      taskEntryYear: new Date().getFullYear().toString()
    });
    this.timeAttendanceForm.markAsPristine();
  }

  installEvent() {
    //  Summary Monthly Mds. By Customer
    this.timeAttendanceForm.controls.taskEntryYear.valueChanges.subscribe(taskEntryYear => {
      this.taskEntryChartData = [];
      if (taskEntryYear) {
        this.db.findPcTaskEntryForChart(taskEntryYear).subscribe(result => {
          this.taskEntryChartData = this.prepareChartData(result);
          this.taskEntryBarChart.data.datasets = this.taskEntryChartData;
          this.taskEntryBarChart.update();
        });
      }
    });
  }

  createChart() {
    const configChart = {
      type: 'line',
      data: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        datasets: this.taskEntryChartData
      },
      options: {
        responsive: true
      }
    };
    const chartId = document.getElementById('taskEntryBarChart');
    this.taskEntryBarChart = new Chart(chartId, configChart);
  }

  prepareChartData(taskEntryHistory: TaskEntryHistory[]) {
    const chartData = [];
    taskEntryHistory.forEach((row, i) => {
      const colorCode = row.custColor ? row.custColor : this.getRandomColor();
      chartData.push({
        label: row.custCode,
        data: [
          row.jan, row.feb, row.mar, row.apr, row.may, row.jun,
          row.jul, row.aug, row.sep, row.oct, row.nov, row.dec
        ],
        backgroundColor: colorCode,
        borderColor: colorCode,
        fill: false,
      });
    });
    return chartData;
  }

  getRandomColor() {
    const myLetters = '0123456789ABCDEF';
    let colorCode = '#';
    for (let i = 0; i < 6; i++) {
      colorCode += myLetters[Math.floor(Math.random() * 16)];
    }
    return colorCode;
  }

  openModal(contentLogin: any) {
    this.timeAttendancePopup = this.modal.open(contentLogin, Size.medium);
  }

  close() {
    this.timeAttendancePopup.hide();
  }

  saveTimeAttendance() {
    this.timeAttendancePopup.hide();
    if (this.isCheckIn && this.timeAttendanceForm.controls.checkInReason.invalid) {
      return;
    } else if (!this.isCheckIn && this.timeAttendanceForm.controls.checkOutReason.invalid) {
      return;
    }
    this.saving = true;
    this.db.save( this.taTimeAttendance, this.timeAttendanceForm.getRawValue()
    ).pipe(
      switchMap(result => this.db.findTaTimeAttendanceByUser()),
      finalize(() => this.saving = false)
    ).subscribe((result) => {
      this.taTimeAttendance = result;
      this.ms.success('message.STD00006');
    });
  }

  isCheckIn(): boolean {
    return this.taTimeAttendance.checkInTime === null;
  }

  isCheckOut(): boolean {
    return this.taTimeAttendance.checkInTime !== null && this.taTimeAttendance.checkOutTime === null;
  }
  wasCheckedOut(): boolean {
    return this.taTimeAttendance.checkInTime !== null && this.taTimeAttendance.checkOutTime !== null;
  }

  goToPage(url) {
    this.router.navigate([url]);
  }

  goToUserProfilePage() {
    this.router.navigate([
      '/su/surt06/detail',
      { userId: this.masterData.userInfo.userId,
        readOnly: false
      }
    ]);
  }
}

