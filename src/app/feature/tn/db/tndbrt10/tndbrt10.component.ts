import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService, SaveDataService } from '@app/core';
import { CommonConstants } from '@app/feature/common/common-constants';
import { FormUtilService, ModalService, Page } from '@app/shared';
import { TranslateService } from '@ngx-translate/core';
import { forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';
import { Tndbrt10Service } from './tndbrt10.service';

@Component({
  selector: 'app-tndbrt10',
  templateUrl: './tndbrt10.component.html',
  styleUrls: ['./tndbrt10.component.scss']
})
export class Tndbrt10Component implements OnInit, OnDestroy {
  public static readonly programCode = 'tndbrt10';
  page = new Page();
  searchForm: FormGroup;
  radioStatus = [{  value: CommonConstants.Status.Active, text: '' }
                , { value: CommonConstants.Status.Inactive, text: '' }
                , { value: CommonConstants.Status.All, text: '' }];
  dbPosition = [];
  constructor(
    private db: Tndbrt10Service,
    private fb: FormBuilder,
    public util: FormUtilService,
    private translate: TranslateService,
    private route: ActivatedRoute,
    private saver: SaveDataService,
    private router: Router,
    private modal: ModalService,
    private ms: MessageService
  ) { }

  ngOnInit() {
    this.createForm();
    if (this.isFormValid()) {
      this.route.data.subscribe((data) => {
        const saveData = this.saver.retrive('TNDBRT10');
        if (saveData) {
          this.searchForm.patchValue(saveData);
        }
        const savePage = this.saver.retrive('TNDBRT10Page');
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
        console.log(this.dbPosition);
      });
    }
  }

  ngOnDestroy(): void {
    this.saver.save(this.searchForm.value, 'TNDBRT10');
    this.saver.save(this.page, 'TNDBRT10Page');
  }

  createForm() {
    this.searchForm = this.fb.group({
      keyword: null,
      active: CommonConstants.Status.All
    });
  }

  searchFunction() {
    this.page.index = 0;
    this.search();
  }

  search() {
    if (this.isFormValid()) {
      this.db.findDbPosition(this.searchForm.value, this.page)
        .subscribe(res => {
          this.dbPosition = res.rows;
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
      active: CommonConstants.Status.All
    });
    this.searchFunction();
  }

  addFunction() {
    this.router.navigate(['/db/tndbrt10/detail']);
  }

  remove(pCode, version) {
    this.modal.confirm('message.STD00003').subscribe(
      (res) => {
        if (res) {
          this.db.delete(pCode, version)
            .subscribe(() => {
              this.ms.success('message.STD00014');
              this.page = this.util.setPageIndex(this.page);
              this.search();
            });
        }
      });
  }

}
