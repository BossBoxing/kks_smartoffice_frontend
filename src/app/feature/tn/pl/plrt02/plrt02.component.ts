import { Component, OnDestroy, OnInit } from '@angular/core';
import { Page, ModalService, FormUtilService, ReportParam } from '@app/shared';
import { Router } from '@angular/router';
import { MessageService, SaveDataService } from '@app/core';
import { Plrt02Service } from './plrt02.service';
import { FormBuilder, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { FormGroup } from '@angular/forms';
import { CommonConstants } from '@app/feature/common/common-constants';
import { forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-plrt02',
  templateUrl: './plrt02.component.html',
  styleUrls: ['./plrt02.component.scss']
})
export class Plrt02Component implements OnInit, OnDestroy {
  public static readonly programCode = 'plrt02';
  page = new Page();
  searchForm: FormGroup;
  plRelease = [];
  reportParam = {} as ReportParam;
  radioStatus = [{ value: CommonConstants.Status.Active, text: '' }
    , { value: CommonConstants.Status.Inactive, text: '' }
    , { value: CommonConstants.Status.All, text: '' }];
  constructor(
    private router: Router,
    private pl: Plrt02Service,
    private fb: FormBuilder,
    private modal: ModalService,
    private ms: MessageService,
    public util: FormUtilService,
    private saver: SaveDataService,
    private translate: TranslateService
  ) { }

  // load data
  ngOnInit(): void {
    this.createForm();
    forkJoin([
      this.translate.get('label.ALL.Active'),
      this.translate.get('label.ALL.Inactive'),
      this.translate.get('label.ALL.All')]
    ).pipe(map(result => {
      this.radioStatus[0].text = result[0];
      this.radioStatus[1].text = result[1];
      this.radioStatus[2].text = result[2];
    })).subscribe();
  }

  createForm() {
    this.searchForm = this.fb.group({
      keyword: null,
      custCode: [null, [Validators.required]],
      active: CommonConstants.Status.All
    });
  }

  // Search & Clear button will reset to first page
  searchFunction() {
    this.page.index = 0;
    this.search();
  }

  onSearchGroupCust = (keyword, value) => {
    return this.pl.findGroupReleaseATC(keyword, value);
  }

  ngOnDestroy(): void {
    this.saver.save(this.searchForm.value, 'PLRT02');
    this.saver.save(this.page, 'PLRT02Page');
  }

  search() {
    if (this.isFormValid()) {
      this.pl.findPlRelease(this.searchForm.value, this.page).subscribe(res => {
        this.plRelease = res.rows;
        this.page.totalElements = res.count;
      });
    }
  }

  isFormValid(): boolean {
    return this.util.isFormGroupValid(this.searchForm);
  }

  clear() {
    this.searchForm.patchValue({
      keyword: null,
      custCode: null,
      active: CommonConstants.Status.All
    });
    this.plRelease = [];
  }

  remove(custCode, releaseCode, rowVersion) {
    this.modal.confirm('message.STD00003').subscribe(
      (res) => {
        if (res) {
          this.pl.delete(custCode, releaseCode, rowVersion)
            .subscribe(() => {
              this.ms.success('message.STD00014');
              this.page = this.util.setPageIndex(this.page);
              this.search();
            });
        }
      });
  }

  addFunction() {
    this.router.navigate(['/pl/plrt02/detail']);
  }

}
