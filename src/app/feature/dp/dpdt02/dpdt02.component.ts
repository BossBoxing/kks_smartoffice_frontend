import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService, SaveDataService } from '@app/core';
import { CommonConstants } from '@app/feature/common/common-constants';
import { FormUtilService, ModalService, Page } from '@app/shared';
import { TranslateService } from '@ngx-translate/core';
import { forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';
import { Dpdt02Service } from './dpdt02.service';

@Component({
  selector: 'app-dpdt02',
  templateUrl: './dpdt02.component.html',
  styleUrls: ['./dpdt02.component.scss']
})
export class Dpdt02Component implements OnInit, OnDestroy {
  public static readonly programCode = 'dpdt02';
  searchForm: FormGroup;
  dpEvaluationMasters = [];
  masterData = {
    status: []
  };
  page = new Page();
  constructor(
    private dp: Dpdt02Service,
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
        this.masterData = data.dpdt02.masterData;
        console.log(this.masterData.status);
        const saveData = this.saver.retrive('DPDT02');
        if (saveData) {
          this.searchForm.patchValue(saveData);
        }
        const savePage = this.saver.retrive('DPDT02Page');
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
      status: CommonConstants.StatusDoc.Wait
    });
  }

  searchFunction() {
    this.page.index = 0;
    this.search();
  }

  search() {
    if (this.isFormValid()) {
      this.dp.findDpEvaluationMaster(this.searchForm.value, this.page)
        .subscribe(res => {
          this.dpEvaluationMasters = res.rows;
          this.page.totalElements = res.count;
        });
    }
  }

  isFormValid(): boolean {
    return this.util.isFormGroupValid(this.searchForm);
  }

  ngOnDestroy(): void {
    this.saver.save(this.searchForm.value, 'DPDT02');
    this.saver.save(this.page, 'DPDT02Page');
  }

  addFunction() {
    this.router.navigate(['/dp/dpdt02/detail']);
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
