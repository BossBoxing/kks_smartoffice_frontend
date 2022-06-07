import { Component, OnDestroy, OnInit } from '@angular/core';
import { Page, ModalService, FormUtilService } from '@app/shared';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService, SaveDataService } from '@app/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';
import { CommonConstants } from '@app/feature/common/common-constants';
import { Tndbrt05Service } from './tndbrt05.service';

@Component({
  selector: 'app-tndbrt05',
  templateUrl: './tndbrt05.component.html',
  styleUrls: ['./tndbrt05.component.scss']
})
export class Tndbrt05Component implements OnInit {
  public static readonly programCode = 'tndbrt05';
  page = new Page();
  dbProvince = [];
  searchForm: FormGroup;
  radioStatus = [{ value: CommonConstants.Status.Active, text: '' }
               , { value: CommonConstants.Status.Inactive, text: '' }
               , { value: CommonConstants.Status.All, text: '' }];
  constructor(
    private db: Tndbrt05Service,
    public util: FormUtilService,
    private translate: TranslateService,
    private fb: FormBuilder,
    private ms: MessageService,
    private router: Router,
    private modal: ModalService,
    private saver: SaveDataService,
    private route: ActivatedRoute
  ) { }
  ngOnInit(): void {
    this.createForm();
    this.route.data.subscribe((data) => {
      const saveData = this.saver.retrive('TNDBRT05');
      if (saveData) {
        this.searchForm.patchValue(saveData);
      }
      const savePage = this.saver.retrive('TNDBRT05Page');
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

  createForm() {
    this.searchForm = this.fb.group({
      // keyword: null,
      keyword: null,
      countryCode: null,
      active: CommonConstants.Status.All
    });
  }

   // Search & Clear button will reset to first page
  searchFunction() {
    this.page.index = 0;
    this.search();
  }

  search() {
    if (this.isFormValid()) {
      this.db.findDbId(this.searchForm.value, this.page)
        .subscribe(response => {
          this.dbProvince  = response.rows;
          this.page.totalElements = response.count;
          console.log(this.dbProvince);
        });
    }
  }

  isFormValid(): boolean {
    return this.util.isFormGroupValid(this.searchForm);
  }

  clear() {
    this.searchForm.patchValue({
      // keyword: null,
      keyword: null,
      countryCode: null,
      active: CommonConstants.Status.All
    });
    this.searchFunction();
  }

  remove(pcode, ccode, rowVersion) {
    this.modal.confirm('message.STD00003').subscribe(
      (response) => {
        if (response) {
          this.db.delete(pcode, ccode, rowVersion)
            .subscribe(() => {
              this.ms.success('message.STD00014');
              this.page = this.util.setPageIndex(this.page);
              this.search();
              console.log(pcode);
              console.log(ccode);
              console.log(rowVersion);
            });
        }
      });
  }

  onSearchCountry = (keyword, value) => {
    return this.db.findCountryCodeForATC(keyword, value);
  }

  addFunction() {
    this.router.navigate(['/db/tndbrt05/detail']);
  }

  // search() {
  //   if (this.isFormValid()) {
  //     this.db.findDbProvince()
  //       .subscribe(res => {
  //         this.dbProvince = res.rows;
  //         this.page.totalElements = res.count;
  //       });
  //   }
  // }
  // isFormValid(): boolean {
  //   return this.util.isFormGroupValid(this.searchForm);
  // }

}

