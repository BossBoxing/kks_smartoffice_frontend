import { Component, OnInit } from '@angular/core';
import { Page, ModalService, FormUtilService } from '@app/shared';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService, SaveDataService } from '@app/core';
import { DbReligion, Dbrt09Service } from './dbrt09.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { forkJoin } from 'rxjs/internal/observable/forkJoin';
import { map } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';
import { CommonConstants } from '@app/feature/common/common-constants';
import { Permission } from '@app/shared/service/permission.service';

@Component({
  selector: 'app-dbrt09',
  templateUrl: './dbrt09.component.html',
  styleUrls: ['./dbrt09.component.scss']
})
export class Dbrt09Component implements OnInit {
  public static readonly programCode = 'dbrt09';
  searchForm: FormGroup;
  page = new Page();
  dbReligion: DbReligion = {} as DbReligion;
  saving = false;
  permission = {} as Permission;
  dbReligions = [];
  radioStatus = [{ value: CommonConstants.Status.Active , text: '' }
              , { value: CommonConstants.Status.Inactive , text: '' }
              , { value: CommonConstants.Status.All , text: '' }];
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    public util: FormUtilService,
    private ms: MessageService,
    private modal: ModalService,
    private db: Dbrt09Service,
    private saver: SaveDataService,
    private translate: TranslateService
  ) { }

  ngOnInit() {
    // load label for radioStatus
    forkJoin([
      this.translate.get('label.ALL.Active'),
      this.translate.get('label.ALL.Inactive'),
      this.translate.get('label.ALL.All')]
    ).pipe(map(result => {
      this.radioStatus[0].text = result[0];
      this.radioStatus[1].text = result[1];
      this.radioStatus[2].text = result[2];
    })).subscribe();

    this.createForm();
    this.route.data.subscribe((data) => {
      this.permission = data.dbrt09.permission;
      const saveData = this.saver.retrive('DBRT09');
      if (saveData)  {
        this.searchForm.patchValue(saveData);
      }
      const savePage = this.saver.retrive('DBRT09Page');
      if (savePage) {
        this.page = savePage;
      }
      this.search();
    });
  }
  // tslint:disable-next-line:use-lifecycle-interface
  ngOnDestroy(): void {
    this.saver.save(this.searchForm.value, 'DBRT09');
    this.saver.save(this.page, 'DBRT09Page');
  }

  createForm() {
    this.searchForm = this.fb.group({
      keyword: null,
      active: CommonConstants.Status.All
    });
  }

  // seach & clear button will reset to first page
  searchFunction() {
    this.page.index = 0;
    this.search();
  }

  search() {
    if (this.isFormValid()) {
      this.db.findDbReligions(this.searchForm.value, this.page)
      .subscribe(res => {
        this.dbReligions = res.rows;
        this.page.totalElements = res.count;
      });
    }
  }

  clear() {
    this.searchForm.patchValue({
      keyword: null,
      active: CommonConstants.Status.All
    });
    this.searchFunction();
  }

  isFormValid(): boolean {
    return this.util.isFormGroupValid(this.searchForm);
  }

  addFunction() {
    this.router.navigate(['/db/dbrt09/detail']);
  }

  remove(national, version) {
    this.modal.confirm('message.STD00003').subscribe(
      (res) => {
        if (res) {
          this.db.delete(national, version)
            .subscribe(() => {
              this.ms.success('message.STD00014');
              this.page = this.util.setPageIndex(this.page);
              this.search();
            });
        }
      });
  }

}
