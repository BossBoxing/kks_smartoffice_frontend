import { Component, OnInit } from '@angular/core';
import { Page, ModalService, FormUtilService } from '@app/shared';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService, SaveDataService } from '@app/core';
import { DbPosition, Dbrt10Service } from './dbrt10.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { forkJoin } from 'rxjs/internal/observable/forkJoin';
import { map } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';
import { CommonConstants } from '@app/feature/common/common-constants';
import { Permission } from '@app/shared/service/permission.service';

@Component({
  selector: 'app-dbrt10',
  templateUrl: './dbrt10.component.html',
  styleUrls: ['./dbrt10.component.scss']
})
export class Dbrt10Component implements OnInit {
  public static readonly programCode = 'dbrt10';
  searchForm: FormGroup;
  page = new Page();
  dbPosition: DbPosition = {} as DbPosition;
  permission = {} as Permission;
  saving = false;
  dbPositions = [];
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
    private db: Dbrt10Service,
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
      this.permission = data.dbrt10.permission;
      const saveData = this.saver.retrive('DBRT10');
      if (saveData)  {
        this.searchForm.patchValue(saveData);
      }
      const savePage = this.saver.retrive('DBRT10Page');
      if (savePage) {
        this.page = savePage;
      }
      this.search();
    });
  }
  // tslint:disable-next-line: use-lifecycle-interface
  ngOnDestroy(): void {
    this.saver.save(this.searchForm.value, 'DBRT10');
    this.saver.save(this.page, 'DBRT10Page');
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
      this.db.findDbPositions(this.searchForm.value, this.page)
      .subscribe(res => {
        this.dbPositions = res.rows;
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
    this.router.navigate(['/db/dbrt10/detail']);
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
