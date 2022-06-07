import { Component, OnDestroy, OnInit } from '@angular/core';
import { Page, ModalService, FormUtilService } from '@app/shared';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService, SaveDataService } from '@app/core';
import { Dbrt11Service } from './dbrt11.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Permission } from '@app/shared/service/permission.service';

@Component({
  selector: 'app-dbrt11',
  templateUrl: './dbrt11.component.html'
})
export class Dbrt11Component implements OnInit, OnDestroy {
  public static readonly programCode = 'dbrt11';
  page = new Page();
  searchForm: FormGroup;
  permission = {} as Permission;
  gbEmployees = [];
  masterData = {
    empTypes: []
    , empStatus: []
  };

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private db: Dbrt11Service,
    private modal: ModalService,
    private fb: FormBuilder,
    private ms: MessageService,
    public util: FormUtilService,
    private saver: SaveDataService
  ) { }

  ngOnInit() {
    this.createForm();
    this.route.data.subscribe((data) => {
      this.permission = data.dbrt11.permission;
      this.masterData = data.dbrt11.masterData;
      const saveData = this.saver.retrive('DBRT11');
      if (saveData) { this.searchForm.patchValue(saveData); }
      const savePage = this.saver.retrive('DBRT11Page');
      if (savePage) { this.page = savePage; }
    });
    this.search();
  }

  ngOnDestroy(): void {
    this.saver.save(this.searchForm.value, 'DBRT11');
    this.saver.save(this.page, 'DBRT11Page');
  }

  createForm() {
    this.searchForm = this.fb.group({
      keyword: null
      , empType: null
      , empStatus: null
    });
  }

  searchFunction() {
    this.page.index = 0;
    this.search();
  }

  search() {
    this.db.findGbEmployees(this.searchForm.value, this.page)
      .subscribe(res => {
        this.gbEmployees = res.rows;
        this.page.totalElements = res.count;
      });
  }

  clear() {
    this.searchForm.reset();
    this.searchFunction();
  }

  addFunction() {
    this.router.navigate(['/db/dbrt11/detail']);
  }

  remove(ouCode, empId, rowVersion) {
    this.modal.confirm('message.STD00003').subscribe(res => {
      if (res) {
        this.db.delete(ouCode, empId, rowVersion).subscribe(() => {
          this.ms.success('message.STD00014');
          this.page = this.util.setPageIndex(this.page);
          this.search();
        });
      }
    });
  }
}
