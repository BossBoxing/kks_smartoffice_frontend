import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService, SaveDataService } from '@app/core';
import { CommonConstants } from '@app/feature/common/common-constants';
import { FormUtilService, ModalService, Page, ReportParam } from '@app/shared';
import { Permission } from '@app/shared/service/permission.service';
import { TranslateService } from '@ngx-translate/core';
import { forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';
import { Plrt01Service } from './plrt01.service';

@Component({
    selector: 'app-plrt01',
    templateUrl: './plrt01.component.html',
    styleUrls: ['./plrt01.component.scss']
})
export class Plrt01Component implements OnInit {
    public static readonly programCode = 'plrt01';
    PlUser = [];
    permission = {} as Permission;
    page = new Page();
    searchForm: FormGroup;
    reportParam = {} as ReportParam;
    radioStatus = [{ value: CommonConstants.Status.Active, text: ' ' }
        , { value: CommonConstants.Status.Inactive, text: ' ' }
        , { value: CommonConstants.Status.All, text: ' ' }];

    constructor(
        private pl: Plrt01Service,
        private translate: TranslateService,
        public util: FormUtilService,
        private modal: ModalService,
        private fb: FormBuilder,
        private ms: MessageService,
        private router: Router,
        private saver: SaveDataService,
        private route: ActivatedRoute,
    ) { }

    ngOnInit(): void {
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
            this.permission = data.plrt01.permission;
            const saveData = this.saver.retrive('PLRT01');
            if (saveData)  {
              this.searchForm.patchValue(saveData);
            }
            const savePage = this.saver.retrive('PLRT01Page');
            if (savePage) {
              this.page = savePage;
            }
            // search data
            this.search();
          });
    }

    // tslint:disable-next-line:use-lifecycle-interface
    ngOnDestroy(): void {
        this.saver.save(this.searchForm.value, 'PLRT01');
        this.saver.save(this.page, 'PLRT01Page');
    }

    createForm() {
        this.searchForm = this.fb.group({
            keyword: null,
            CustCode: null,
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
            this.pl.findPlCustomer(this.searchForm.value, this.page)
                .subscribe(res => {
                    this.PlUser = res.rows;
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
            CustCode: null,
            active: CommonConstants.Status.All
        });
        this.searchFunction();
    }

    remove(code, version) {
        this.modal.confirm('message.STD00003').subscribe(
            (res) => {
                if (res) {
                    this.pl.delete(code, version)
                        .subscribe(() => {
                            this.ms.success('message.STD00014');
                            this.page = this.util.setPageIndex(this.page);
                            this.search();
                        });
                }
            });
    }

    addFunction() {
        this.router.navigate(['/pl/plrt01/detail']);
    }

}
