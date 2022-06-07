import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from '@app/core';
import { CommonConstants } from '@app/feature/common/common-constants';
import { FormUtilService, ModalService, Page } from '@app/shared';
import { TranslateService } from '@ngx-translate/core';
import { forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';
import { Surt02Service } from './surt02.service';

@Component({
  selector: 'app-surt02',
  templateUrl: './surt02.component.html',
  styleUrls: ['./surt02.component.scss']
})
export class Surt02Component implements OnInit {
  public static readonly programCode = 'surt02';
  SuUser = [];
  page = new Page();
  searchForm: FormGroup;
  radioStatus = [{  value: CommonConstants.Status.Active, text: '' }
               , { value: CommonConstants.Status.Inactive, text: '' }
               , { value: CommonConstants.Status.All, text: '' }];
  constructor(
    private service: Surt02Service,
    private translate: TranslateService,
    public util: FormUtilService,
    private modal: ModalService,
    private fb: FormBuilder,
    private ms: MessageService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.createForm();
    this.service.findUsers().subscribe((Response) => {
      this.SuUser = Response.rows;
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
      console.log(this.SuUser);

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
      this.service.findsuUser(this.searchForm.value, this.page)
        .subscribe(res => {
          this.SuUser  = res.rows;
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

  remove(code, version) {
    this.modal.confirm('message.STD00003').subscribe(
      (res) => {
        if (res) {
          this.service.delete(code, version)
            .subscribe(() => {
              this.ms.success('message.STD00014');
              this.page = this.util.setPageIndex(this.page);
              this.search();
            });
        }
      });
  }

  addFunction() {
    this.router.navigate(['/su/surt02/detail']);
  }

}
