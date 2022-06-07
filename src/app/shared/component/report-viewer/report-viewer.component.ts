import { EventEmitter, Input, Optional, Output, Self } from '@angular/core';
import { Component, ViewChild} from '@angular/core';
import { FormBuilder, FormGroup, NgControl } from '@angular/forms';
import { FormUtilService } from '@app/shared';
import { ContentType, ReportParam, ReportService } from '@app/shared/service/report.service';
import { BehaviorSubject } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { BaseFormField } from '../base-form';

@Component({
  selector: 'report-viewer',
  templateUrl: './report-viewer.component.html',
  styleUrls: ['./report-viewer.component.scss']
})
export class ReportViewerComponent extends BaseFormField  {

  @Output() validateScreen: EventEmitter<any> = new EventEmitter<any>(false);
  @Output() assignReportParam: EventEmitter<any> = new EventEmitter<any>(false);
  @Output() exportTypeChange: EventEmitter<any> = new EventEmitter<any>(false);
  @Output() afterClearCriteria: EventEmitter<any> = new EventEmitter<any>(false);
  @Input() isScreenValid: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  @Input() reportParam = {} as ReportParam;
  @Input() criteriaForm: FormGroup = null;
  @Input() pdfButton = true;
  @Input() excelButton = true;
  @Input() previewPdf = true;
  @Input() downloadLabel = 'label.ALL.Download';
  @Input() previewLabel = 'label.ALL.PreviewPDF';
  downloading = false;
  previewing = false;
  pdfResult = null;
  searchForm: FormGroup;

  exportTypeItems = [ { text: ContentType.PDF.toUpperCase(), value: ContentType.PDF, disabled: !this.pdfButton },
                      { text: 'Excel' , value: ContentType.EXCEL, disabled: !this.excelButton }];

  constructor(
    @Optional() @Self() public controlDir: NgControl,
    private fb: FormBuilder,
    public util: FormUtilService,
    private rs: ReportService) {
    super(controlDir);
  }

  ngOnInit() {
    this.createForm();
    this.isScreenValid.next(true);
  }

  createForm() {
    this.searchForm = this.fb.group({
      exportType: this.pdfButton ? ContentType.PDF : this.excelButton ? ContentType.EXCEL : null
    });
    this.searchForm.controls.exportType.valueChanges.subscribe(exportType => {
      if (exportType === ContentType.EXCEL) {
        this.pdfResult = '';
      }
      if (this.criteriaForm && this.criteriaForm.controls.exportType) {
        this.criteriaForm.controls.exportType.setValue(exportType);
      }
      this.exportTypeChange.emit(exportType);
    });
    this.searchForm.controls.exportType.updateValueAndValidity();
    if (this.pdfButton === false && this.excelButton === false) {
      this.searchForm.disable();
    }
  }

  previewReport() {
    this.previewing = true;
    this.print();
  }

  downloadFile() {
    this.downloading = true;
    if (this.isPrintPdf()) {
      if (this.pdfResult) {
        this.rs.Download(this.rs.getDownlaodPdfType() + this.pdfResult, this.reportParam);
        this.downloading = false;
      } else {
        this.print(true);
      }
    } else {
      this.print();
    }
  }

  print(noPreview: boolean = false) {
    this.validateScreen.emit();
    if (this.isCriteriaFormValid() && this.isScreenValid.getValue()) {
      this.pdfResult = '';
      this.assignReportParam.emit();
      this.reportParam.exportType = this.searchForm.controls.exportType.value;
      this.reportParam.printTime = new Date();
      this.rs.generateReportBase64(this.reportParam).pipe(
        finalize(() => {
          this.previewing = false;
          this.downloading = false;
        })
      ).subscribe((res: any) => {
        if (res) {
          if (this.isPrintPdf()) {
            if (noPreview) {
              this.rs.Download(this.rs.getDownlaodPdfType() + res, this.reportParam);
            } else {
              this.pdfResult = res;
            }
          } else {
            this.rs.Download(res, this.reportParam);
          }
        }
      });
    } else {
      this.previewing = false;
      this.downloading = false;
    }
  }

  clearCriteriaForm() {
    if (this.criteriaForm) {
        this.criteriaForm.reset();
    }
    this.pdfResult = '';
    this.afterClearCriteria.emit();
  }

  isCriteriaFormValid(): boolean {
    if (this.criteriaForm) {
      return this.util.isFormGroupValid(this.criteriaForm);
    } else {
      return true;
    }
  }

  isPrintPdf(): boolean {
    return this.searchForm.controls.exportType.value === ContentType.PDF;
  }

  getExportTypeText() {
    const row = this.exportTypeItems.find(row => row.value === this.searchForm.controls.exportType.value);
    return row ? row.text : '';
  }
}
