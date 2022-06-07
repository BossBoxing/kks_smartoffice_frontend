import { Component, OnInit } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { Page, ModalService, FormUtilService, RowState, ReportService, ReportParam } from "@app/shared";
import { ReportSsruService} from "./reportssru.service";
import { ActivatedRoute, Router } from "@angular/router";
import { MessageService, SaveDataService } from "@app/core";
import { switchMap, finalize } from 'rxjs/operators';
import { Observable, of } from 'rxjs';

@Component({
  selector: "app-report",
  templateUrl: "./reportssru.component.html",
  styleUrls: ["./reportssru.component.scss"]
})
export class ReportSsruComponent implements OnInit {
  
  searchForm: FormGroup;
  printing: boolean;
  reportParam = {} as ReportParam
  srcResult = null;
  disable : boolean  = true;

studentCode = [{ text: '001 : พรรธิดา มีสุข', value: '001'},
               { text: '002 : พรรธิดา อิ่มสุข', value: '002'},
               { text: '003 : พรรธิดา อุ้มสุข', value: '003'}]

radioItems = [{ value: 'PDF', text: 'PDF' }, { value: 'XLSX', text: 'Excel' }]


  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private modal: ModalService,
    private ms: MessageService,
    public util: FormUtilService,
    private saver: SaveDataService,
    private rs: ReportService
  ) {}

  ngOnInit() {
    this.createSearchForm();
  }

 
  createSearchForm() {
    this.searchForm = this.fb.group({
      studentCodeFrom : null,
      studentCodeTo : null,
      Radio : 'PDF',
    });
    
    this.searchForm.controls.Radio.valueChanges.subscribe(res => {
        if(res == 'PDF'){
            this.disable = true;
        }
        else this.disable = false;
    })

    
  }


  rebuildForm() {
     
  }

  
  clear() {
    this.searchForm.reset();
    this.searchForm.controls.Radio.setValue('PDF');
  }

  print() {
    this.printing = true;
    
    let objParam = {
      "student_code_from" : this.searchForm.controls.studentCodeFrom.value,
      "student_code_to" : this.searchForm.controls.studentCodeTo.value
    } ;
    this.reportParam.paramsJson = objParam;
    this.reportParam.module = 'DEMO';
    this.reportParam.reportName = 'ReportTestList';
    this.reportParam.exportType = this.searchForm.controls.Radio.value;

    this.rs.generateReportBase64(this.reportParam).pipe(
      finalize(() => {
        this.printing = false;
      })
    )
      .subscribe((res:any) => {
        if (res) {
          if(this.searchForm.controls.Radio.value == 'PDF'){
            this.srcResult = res;
          }
           else{
            this.srcResult = '';
            this.DowloadFile(res, this.reportParam.reportName )
           } 
        }
      });
  }

  async DowloadFile(data, reportName){
    let a = document.createElement("a")
    a.href = data;
    a.download = reportName + ".xlsx"
    a.click();
  }

}
