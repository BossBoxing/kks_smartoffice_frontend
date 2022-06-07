import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService, SaveDataService } from '@app/core';
import { CommonConstants } from '@app/feature/common/common-constants';
import { FormUtilService, ModalService, Page } from '@app/shared';
import { TranslateService } from '@ngx-translate/core';
import { forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';
import { Dprt02Service } from './dprt02.service';

@Component({
  selector: 'app-dprt02',
  templateUrl: './dprt02.component.html',
  styleUrls: ['./dprt02.component.scss']
})
export class Dprt02Component implements OnInit, OnDestroy {
  public static readonly programCode = 'dprt02';
  searchForm: FormGroup;
  dpPeriods = [];
  radioStatus = [{ value: CommonConstants.Status.Active, text: '' }
    , { value: CommonConstants.Status.Inactive, text: '' }
    , { value: CommonConstants.Status.All, text: '' }];
  page = new Page();
  constructor(
    private dp: Dprt02Service,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private saver: SaveDataService,
    private translate: TranslateService,
    public util: FormUtilService,
    private router: Router
  ) { }

  ngOnInit() {
    this.createForm();
    if (this.isFormValid()) {
      this.route.data.subscribe((data) => {
        const saveData = this.saver.retrive('DPRT02');
        if (saveData) {
          this.searchForm.patchValue(saveData);
        }
        const savePage = this.saver.retrive('DPRT02Page');
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
      active: CommonConstants.Status.All,
      startDate: null
    });
  }

  searchFunction() {
    this.page.index = 0;
    this.search();
  }

  search() {
    if (this.isFormValid()) {
      this.dp.findDpPeriods(this.searchForm.value, this.page)
        .subscribe(res => {
          this.dpPeriods = res.rows;
          this.page.totalElements = res.count;
          console.log(this.dpPeriods);
        });
    }
  }

  isFormValid(): boolean {
    return this.util.isFormGroupValid(this.searchForm);
  }

  ngOnDestroy(): void {
    this.saver.save(this.searchForm.value, 'DPRT02');
    this.saver.save(this.page, 'DPRT02Page');
  }

  addFunction() {
    this.router.navigate(['/dp/dprt02/detail']);
  }

  clear() {
    this.searchForm.patchValue({
      keyword: null,
      active: CommonConstants.Status.All,
      startDate: null
    });
    this.searchFunction();
  }

}

