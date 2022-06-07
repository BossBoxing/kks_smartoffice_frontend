import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService, SaveDataService } from '@app/core';
import { CommonConstants } from '@app/feature/common/common-constants';
import { FormUtilService, ModalService, Page } from '@app/shared';
import { TranslateService } from '@ngx-translate/core';
import { forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';
import { Dpdt01Service } from './dpdt01.service';

@Component({
  selector: 'app-dpdt01',
  templateUrl: './dpdt01.component.html',
  styleUrls: ['./dpdt01.component.scss']
})
export class Dpdt01Component implements OnInit, OnDestroy {
  public static readonly programCode = 'dpdt01';
  searchForm: FormGroup;
  masterData = {
    status: []
  };
  dpTransectionMasters = [];
  page = new Page();
  constructor(
    private dp: Dpdt01Service,
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
        this.masterData = data.dpdt01.masterData;
        console.log(this.masterData.status);
        const saveData = this.saver.retrive('DPDT01');
        if (saveData) {
          this.searchForm.patchValue(saveData);
        }
        const savePage = this.saver.retrive('DPDT01Page');
        if (savePage) {
          this.page = savePage;
        }
        forkJoin([
          this.translate.get('label.ALL.Active'),
          this.translate.get('label.ALL.Inactive'),
          this.translate.get('label.ALL.All')]
        ).pipe(map(result => {
        })).subscribe();
        this.search();
      });
    }
  }
  createForm() {
    this.searchForm = this.fb.group({
      keyword: null,
      status: null
    });
  }

  searchFunction() {
    this.page.index = 0;
    this.search();
  }

  search() {
    if (this.isFormValid()) {
      this.dp.findDpTransectionMaster(this.searchForm.value, this.page)
        .subscribe(res => {
          this.dpTransectionMasters = res.rows;
          this.page.totalElements = res.count;
        });
    }
  }

  isFormValid(): boolean {
    return this.util.isFormGroupValid(this.searchForm);
  }

  ngOnDestroy(): void {
    this.saver.save(this.searchForm.value, 'DPDT01');
    this.saver.save(this.page, 'DPDT01Page');
  }

  addFunction() {
    this.router.navigate(['/dp/dpdt01/detail']);
  }

  clear() {
    this.searchForm.patchValue({
      keyword: null,
      active: CommonConstants.Status.All,
      status: null
    });
    this.searchFunction();
  }
}
