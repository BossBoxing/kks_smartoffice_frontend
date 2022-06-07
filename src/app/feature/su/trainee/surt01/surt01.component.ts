import { Component, OnInit } from '@angular/core';
import { Page, ModalService, FormUtilService } from '@app/shared';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService, SaveDataService } from '@app/core';
import { Surt01Service, SuUser } from './surt01.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';
import { CommonConstants } from '@app/feature/common/common-constants';

@Component({
  selector: 'app-surt01',
  templateUrl: './surt01.component.html',
  styleUrls: ['./surt01.component.scss']
})
export class Surt01Component implements OnInit {
  public static readonly programCode = 'surt01';
  suUser = [];
  page = new Page();
  searchForm: FormGroup;
  radioStatus = [{ value: CommonConstants.Status.Active, text: '' }
                , { value: CommonConstants.Status.Inactive, text: '' }
                , { value: CommonConstants.Status.All, text: '' }];
  constructor(
    private router: Router,
    private service: Surt01Service,
    private fb: FormBuilder,
    private modal: ModalService,
    private ms: MessageService,
    public util: FormUtilService,
    private translate: TranslateService
  ) { }

  ngOnInit(): void {
    this.createForm();
    this.service.findUsers().subscribe((Response) => {
      this.suUser = Response.rows;
      this.page.totalElements = Response.count;
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
      keyword: null,
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
      this.service.findSuUser(this.searchForm.value, this.page)
        .subscribe(res => {
          this.suUser = res.rows;
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
    this.router.navigate(['/su/surt01/detail']);
  }

}
