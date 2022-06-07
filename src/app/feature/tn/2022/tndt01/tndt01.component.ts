import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService, SaveDataService } from '@app/core';
import { CommonConstants } from '@app/feature/common/common-constants';
import { FormUtilService, ModalService, Page, Size } from '@app/shared';
import { TranslateService } from '@ngx-translate/core';
import { forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';
import { Tndt01Service } from './tndt01.service';
import { BsModalRef } from 'ngx-bootstrap';

@Component({
  selector: 'app-tndt01',
  templateUrl: './tndt01.component.html',
  styleUrls: ['./tndt01.component.scss']
})
export class Tndt01Component implements OnInit, OnDestroy {
  public static readonly programCode = 'tndt01';
  templatePopup: BsModalRef;
  searchForm: FormGroup;
  transMaster = [];
  radioStatus = [{  value: CommonConstants.Status.Active, text: '' }
                , { value: CommonConstants.Status.Inactive, text: '' }
                , { value: CommonConstants.Status.All, text: '' }];
  page = new Page();
  constructor(
    private db: Tndt01Service,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private saver: SaveDataService,
    private translate: TranslateService,
    public util: FormUtilService,
    private router: Router,
    private modal: ModalService,
    private ms: MessageService
  ) { }

  ngOnInit() {
    this.createForm();
    if (this.isFormValid()) {
      this.route.data.subscribe((data) => {
        const saveData = this.saver.retrive('TNDT01');
        if (saveData) {
          this.searchForm.patchValue(saveData);
        }
        const savePage = this.saver.retrive('TNDT01Page');
        if (savePage) {
          this.page = savePage;
        }
        forkJoin([
          this.translate.get('label.ALL.Active'),
          this.translate.get('label.ALL.Inactive'),
          this.translate.get('label.ALL.All')]
        ).pipe(map(result => {
          this.radioStatus[0].text = result[0];
          this.radioStatus[1].text = result[1];
          this.radioStatus[2].text = result[2];
        })).subscribe();
        this.search();
      });
    }
  }

  createForm() {
    this.searchForm = this.fb.group({
      keyword: null,
      keywordYear: null,
      keywordPeriod: null,
      active: CommonConstants.Status.All
    });
  }

  searchFunction() {
    this.page.index = 0;
    this.search();
  }

  search() {
    // // if (this.isFormValid()) {
    //   if(this.searchForm.controls['keywordYear'].value == null){
    //     this.searchForm.controls['keywordYear'].setValue(0);
    //   }
    //   if(this.searchForm.controls['keywordPeriod'].value == null){
    //     this.searchForm.controls['keywordPeriod'].setValue(0);
      // }
      this.db.findTnIdpTransMaster(this.searchForm.controls['keyword'].value
      , ((this.searchForm.controls['keywordYear'].value == null) ? 0 : this.searchForm.controls['keywordYear'].value)
      , ((this.searchForm.controls['keywordPeriod'].value == null) ? 0 : this.searchForm.controls['keywordPeriod'].value)
      , this.page)
        .subscribe(res => {
          this.transMaster = res.rows;
          this.page.totalElements = res.count;
          // console.log(this.transMaster);
        });
    // }
  }

  isFormValid(): boolean {
    // return this.util.isFormGroupValid(this.searchForm);
    return true;
  }

  ngOnDestroy(): void {
    this.saver.save(this.searchForm.value, 'TNDT01');
    this.saver.save(this.page, 'TNDT01Page');
  }

  addFunction() {
    this.router.navigate(['tn/2022/tndt01/detail']);
  }

  remove(tCode, version) {
    this.modal.confirm('message.STD00003').subscribe(
      (res) => {
        if (res) {
          this.db.delete(tCode, version)
            .subscribe(() => {
              this.ms.success('message.STD00014');
              this.page = this.util.setPageIndex(this.page);
              this.search();
            });
        }
      });
  }

  clear() {
    this.searchForm.patchValue({
      keyword: null,
      keywordYear: null,
      keywordPeriod: null,
      active: CommonConstants.Status.All
    });
    this.searchFunction();
  }

  template(content: any) {
    this.templatePopup = this.modal.open(content, Size.large);
  }

  close() {
    this.templatePopup.hide();
  }
}
