import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService, SaveDataService } from '@app/core';
import { CommonConstants } from '@app/feature/common/common-constants';
import { FormUtilService, ModalService, Page } from '@app/shared';
import { TranslateService } from '@ngx-translate/core';
import { forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';
import { Tndbrt03Service } from './tndbrt03.service';

@Component({
  selector: 'app-tndbrt03',
  templateUrl: './tndbrt03.component.html',
  styleUrls: ['./tndbrt03.component.scss']
})
export class Tndbrt03Component implements OnInit, OnDestroy {
  public static readonly programCode = 'tndbrt03';
  searchForm: FormGroup;
  dbTitle = [];
  radioStatus = [{  value: CommonConstants.Status.Active, text: '' }
                , { value: CommonConstants.Status.Inactive, text: '' }
                , { value: CommonConstants.Status.All, text: '' }];
  page = new Page();
  constructor(
    private db: Tndbrt03Service,
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
        const saveData = this.saver.retrive('TNDBRT03');
        if (saveData) {
          this.searchForm.patchValue(saveData);
        }
        const savePage = this.saver.retrive('TNDBRT03Page');
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
      active: CommonConstants.Status.All
    });
  }

  searchFunction() {
    this.page.index = 0;
    this.search();
  }

  search() {
    if (this.isFormValid()) {
      this.db.findDbTitle(this.searchForm.value, this.page)
        .subscribe(res => {
          this.dbTitle = res.rows;
          this.page.totalElements = res.count;
          console.log(this.dbTitle);
        });
    }
  }

  isFormValid(): boolean {
    return this.util.isFormGroupValid(this.searchForm);
  }

  ngOnDestroy(): void {
    this.saver.save(this.searchForm.value, 'TNDBRT03');
    this.saver.save(this.page, 'TNDBRT03Page');
  }

  addFunction() {
    this.router.navigate(['/db/tndbrt03/detail']);
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
      active: CommonConstants.Status.All
    });
    this.searchFunction();
  }

}
