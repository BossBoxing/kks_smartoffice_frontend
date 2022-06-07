import { Component, OnInit } from '@angular/core';
import { Page, ModalService, FormUtilService } from '@app/shared';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService, SaveDataService } from '@app/core';
import { Dbrt05Service } from './dbrt05.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';
import { CommonConstants } from '@app/feature/common/common-constants';
import { Permission } from '@app/shared/service/permission.service';

@Component({
  selector: 'app-dbrt05',
  templateUrl: './dbrt05.component.html',
  styleUrls: ['./dbrt05.component.scss']
})
export class Dbrt05Component implements OnInit {
  // declare local variable
  public static readonly programCode = 'dbrt05';
  page = new Page();
  searchForm: FormGroup;
  dbProvinces = [];
  permission = {} as Permission;
  radioStatus = [{ value: CommonConstants.Status.Active , text: '' }
              , { value: CommonConstants.Status.Inactive , text: '' }
              , { value: CommonConstants.Status.All , text: '' }];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private db: Dbrt05Service,
    private fb: FormBuilder,
    private modal: ModalService,
    private ms: MessageService,
    public util: FormUtilService,
    private saver: SaveDataService,
    private translate: TranslateService
  ) { }

  // load data
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
      this.permission = data.dbrt05.permission;
      const saveData = this.saver.retrive('DBRT05');
      if (saveData)  {
        this.searchForm.patchValue(saveData);
      }
      const savePage = this.saver.retrive('DBRT05Page');
      if (savePage) {
        this.page = savePage;
      }
    });
    // search data
    this.search();
  }

  // tslint:disable-next-line: use-lifecycle-interface
  ngOnDestroy(): void {
    this.saver.save(this.searchForm.value, 'DBRT05');
    this.saver.save(this.page, 'DBRT05Page');
  }

  createForm() {
    this.searchForm = this.fb.group({
      countryCode: null,
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
    this.db.findDbProvinces(this.searchForm.value, this.page)
      .subscribe(res => {
        this.dbProvinces = res.rows;
        this.page.totalElements = res.count;
      });
    }
  }

  clear() {
    this.searchForm.patchValue({
      countryCode: null,
      keyword: null,
      active: CommonConstants.Status.All
    });
    this.searchFunction();
  }

  isFormValid(): boolean {
    return this.util.isFormGroupValid(this.searchForm);
  }

  onSearchCountry = (keyword, value) => {
    return this.db.findCountryForATC(keyword, value);
  }

  addFunction() {
    this.router.navigate(['/db/dbrt05/detail']);
  }

  remove(countryCode, provinceCode, version) {
    this.modal.confirm('message.STD00003').subscribe(
      (res) => {
        if (res) {
          this.db.delete(countryCode, provinceCode, version)
            .subscribe(() => {
              this.ms.success('message.STD00014');
              this.page = this.util.setPageIndex(this.page);
              this.search();
            });
        }
      });
  }
}
