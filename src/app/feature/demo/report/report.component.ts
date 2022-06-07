import { Component, OnInit } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { Page, ModalService, FormUtilService, RowState, ReportService } from "@app/shared";
import { ReportService as DemoReportService, ReportParam } from "./report.service";
import { ActivatedRoute, Router } from "@angular/router";
import { MessageService, SaveDataService } from "@app/core";
import { switchMap, finalize } from 'rxjs/operators';
import { Observable, of } from 'rxjs';

@Component({
  selector: "app-report",
  templateUrl: "./report.component.html",
  styleUrls: ["./report.component.scss"]
})
export class ReportComponent implements OnInit {

  searchForm: FormGroup;
  printing: boolean;
  reportParam = {} as ReportParam
  srcResult = null;
  disable: boolean = true;
  facCodeList = [{ text: '10 : คณะศิลปวิจิตร', value: '10' }
    , { text: '20 : คณะศิลปนาฏดุริยางค์', value: '20' }
    , { text: '30 : คณะศิลปศึกษา', value: '30' }
    , { text: '40 : คณะวิศวกรรมศาสตร์', value: '40' }];
  radioItems = [{ value: 'pdf', text: 'PDF' }, { value: 'xlsx', text: 'Excel' }]

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private modal: ModalService,
    private ms: MessageService,
    public util: FormUtilService,
    private saver: SaveDataService,
    private ds: DemoReportService,
    private rs: ReportService
  ) { }

  ngOnInit() {
    this.createSearchForm();
  }


  createSearchForm() {
    this.searchForm = this.fb.group({
      FacCode: null,
      Radio: 'pdf',
    });

    this.searchForm.controls.Radio.valueChanges.subscribe(res => {
      if (res == 'pdf') {
        this.disable = true;
      }
      else this.disable = false;
    })


  }


  rebuildForm() {

  }


  clear() {
    this.searchForm.reset();
  }

  print() {
    this.printing = true;
    Object.assign(this.reportParam, this.searchForm.value);
    this.reportParam.ReportName = 'StudentInfomation';
    this.reportParam.ExportType = this.searchForm.controls.Radio.value;

    this.ds.generateReport(this.reportParam).pipe(
      finalize(() => {
        this.printing = false;
      })
    ).subscribe((res: any) => {
      if (res) {
        if (this.searchForm.controls.Radio.value == 'pdf') {
          this.srcResult = res;
        }
        else {
          this.srcResult = '';
          this.rs.download(res);
        }
      }
    });
  }
}
