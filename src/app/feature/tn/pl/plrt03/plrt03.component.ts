import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from '@app/core';
import { FormUtilService, ModalService, Page, Size } from '@app/shared';
import { CustomValidators } from '@app/shared/directive/custom.validator';
import { Plrt03LookupService } from '../service/plrt03-lookup.service';
import { DbHoliday, Plrt03Service } from '../service/plrt03.service';
import { Plrt03LookupComponent } from './plrt03-lookup/plrt03-lookup.component';

@Component({
  selector: 'app-plrt03',
  templateUrl: './plrt03.component.html',
  styleUrls: ['./plrt03.component.scss']
})
export class Plrt03Component implements OnInit {
  public static readonly programCode = 'plrt03';
  plHolidays = [];
  dbHoliday: DbHoliday = {} as DbHoliday;
  page = new Page();
  searchForm: FormGroup;
  saving = false;
  Plrt03Lookup = Plrt03LookupComponent;
  Plrt03LookupService = Plrt03LookupService;

  constructor(
    private pl: Plrt03Service,
    public util: FormUtilService,
    private modal: ModalService,
    private fb: FormBuilder,
    private ms: MessageService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.createForm();
  }

  createForm() {
    this.searchForm = this.fb.group({
      holidayYear: [null, [Validators.required, CustomValidators.fixLength(4)]],
      holidayName: null
    });
  }

  searchFunction() {
    this.page.index = 0;
    this.search();
  }

  search() {
    if (this.isFormValid()) {
      console.log(this.searchForm.value);
      this.pl.findPlHoliday(this.searchForm.value, this.page)
        .subscribe(res => {
          this.plHolidays = res.rows;
          this.page.totalElements = res.count;
        });
    }
  }

  isFormValid(): boolean {
    return this.util.isFormGroupValid(this.searchForm);
  }

  clear() {
    this.searchForm.reset();
  }

  remove(ouCode, holidayYear, holidayName, rowVersion) {
    this.modal.confirm('message.STD00003').subscribe(
      (res) => {
        if (res) {
          this.pl.delete(ouCode, holidayYear, holidayName, rowVersion)
            .subscribe(() => {
              this.ms.success('message.STD00014');
              this.page = this.util.setPageIndex(this.page);
              this.search();
            });
        }
      });
  }

  addFunction() {
    this.router.navigate(['/pl/plrt03/detail']);
  }

  viewTemplate() {
    this.modal.openComponent(this.Plrt03Lookup, Size.large);
  }

}
