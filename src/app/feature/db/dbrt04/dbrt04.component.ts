import { Component, OnInit } from '@angular/core';
import { Page, ModalService, FormUtilService } from '@app/shared';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService, SaveDataService } from '@app/core';
import { Dbrt04Service } from './dbrt04.service';
import { FormGroup } from '@angular/forms';
import { FormBuilder } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { map } from 'rxjs/operators';
import { forkJoin } from 'rxjs';
import { CommonConstants } from '@app/feature/common/common-constants';
import { Permission } from '@app/shared/service/permission.service';

@Component({
  selector: 'app-dbrt04',
  templateUrl: './dbrt04.component.html',
  styleUrls: ['./dbrt04.component.scss']
})
export class Dbrt04Component implements OnInit {
  // declare local variable
  public static readonly programCode = 'dbrt04';
  page = new Page();
  searchForm: FormGroup;
  dbCountries = [];
  permission = {} as Permission;
  radioStatus = [{ value: CommonConstants.Status.Active , text: '' }
              , { value: CommonConstants.Status.Inactive , text: '' }
              , { value: CommonConstants.Status.All , text: '' }];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private db: Dbrt04Service,
    private fb: FormBuilder,
    private modal: ModalService,
    private ms: MessageService,
    public util: FormUtilService,
    private saver: SaveDataService,
    private translate: TranslateService
  ) { }
  // end of declare local variable

  // initail form ครั้งแรกที่เข้าหน้าจอ
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
      this.permission = data.dbrt04.permission;
      const saveData = this.saver.retrive('DBRT04');
      if (saveData)  {
        this.searchForm.patchValue(saveData);
      }
      const savePage = this.saver.retrive('DBRT04Page');
      if (savePage) {
        this.page = savePage;
      }
      // search data
      this.search();
    });
  }

  // tslint:disable-next-line: use-lifecycle-interface
  ngOnDestroy(): void {
    this.saver.save(this.searchForm.value, 'DBRT04');
    this.saver.save(this.page, 'DBRT04Page');
  }

  createForm() {
    this.searchForm = this.fb.group({
      keyword: null,
      active: CommonConstants.Status.Active
    });
  }

  // seach & clear button will reset to first page
  searchFunction() {
    this.page.index = 0;
    this.search();
  }

  search() {
    if (this.isFormValid()) {
      this.db.findDbCountries(this.searchForm.value, this.page)
        .subscribe(res => {
            this.dbCountries = res.rows;
            this.page.totalElements = res.count;
        });
    }
  }

  clear() {
    this.searchForm.patchValue({
      keyword: null,
      active: CommonConstants.Status.Active
    });
    this.searchFunction(); // ค้นหาใหม่ทุกครั้งที่ clear form
  }

  isFormValid(): boolean {
    return this.util.isFormGroupValid(this.searchForm);
  }

  addFunction() {
    this.router.navigate(['/db/dbrt04/detail']);
  }

  remove(code, version) {
    // กรุณายืนยันการลบข้อมูล
    this.modal.confirm('message.STD00003').subscribe(
      (res) => {
        if (res) {
          this.db.delete(code, version)
            .subscribe(() => {
              this.ms.success('message.STD00014'); // การลบข้อมูลสำเร็จ
              this.page = this.util.setPageIndex(this.page);
              this.search();
            });
        }
      });
  }
}
