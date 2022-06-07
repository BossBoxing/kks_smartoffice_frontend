import { Component, OnDestroy, OnInit } from '@angular/core';
import { Page, FormUtilService } from '@app/shared';
import { ActivatedRoute, Router } from '@angular/router';
import { SaveDataService } from '@app/core';
import { Surt06Service } from './surt06.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';
import { CommonConstants } from '@app/feature/common/common-constants';
import { Permission } from '@app/shared/service/permission.service';

@Component({
  selector: 'app-surt06',
  templateUrl: './surt06.component.html',
  styleUrls: ['./surt06.component.scss']
})
export class Surt06Component implements OnInit, OnDestroy {
  // declare local variable
  public static readonly programCode = 'surt06';
  page = new Page();
  searchForm: FormGroup;
  suUsers = [];
  permission = {} as Permission;
  radioStatus = [{ value: CommonConstants.Status.Active , text: '' }
              , { value: CommonConstants.Status.Inactive , text: '' }
              , { value: CommonConstants.Status.All , text: '' }];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private su: Surt06Service,
    private fb: FormBuilder,
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
      this.permission = data.surt06.permission;
      const saveData = this.saver.retrive('SURT06');
      if (saveData)  {
        this.searchForm.patchValue(saveData);
      }
      const savePage = this.saver.retrive('SURT06Page');
      if (savePage) {
        this.page = savePage;
      }
    });
    // search data
    this.search();
  }

  ngOnDestroy(): void {
    this.saver.save(this.searchForm.value, 'SURT06');
    this.saver.save(this.page, 'SURT06Page');
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
    this.su.findSuUsers(this.searchForm.value, this.page)
    .subscribe(res => {
      this.suUsers = res.rows;
      this.page.totalElements = res.count;
    });
  }

  clear() {
    this.searchForm.patchValue({
      keyword: null,
      active: CommonConstants.Status.All
    });
    this.searchFunction();
  }

  addFunction() {
    this.router.navigate(['/su/surt06/detail']);
  }
}
