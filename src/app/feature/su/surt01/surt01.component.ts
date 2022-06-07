import { Component, OnDestroy, OnInit } from '@angular/core';
import { Surt01Service } from './surt01.service';
import { Page, ModalService, FormUtilService } from '@app/shared';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService, SaveDataService } from '@app/core';

@Component({
  selector: 'app-surt01',
  templateUrl: './surt01.component.html'
})
export class Surt01Component implements OnInit, OnDestroy {
  public static readonly programCode = 'surt01';
  page = new Page();
  keyword = '';
  organizes = [];
  permission = {
    isReadOnly: null
  };

  constructor(
    private su: Surt01Service,
    private route: ActivatedRoute,
    private router: Router,
    private modal: ModalService,
    private ms: MessageService,
    private util: FormUtilService,
    private saver: SaveDataService
  ) { }

  ngOnInit() {
    this.route.data.subscribe((data) => {
      const saveData = this.saver.retrive('SURT01');
      if (saveData) { this.keyword = saveData; }
      const savePage = this.saver.retrive('SURT01Page');
      if (savePage) { this.page = savePage; }
      this.search();
    });
  }

  ngOnDestroy() {
    this.saver.save(this.keyword, 'SURT01');
    this.saver.save(this.page, 'SURT01Page');
  }

  enter(value) {
    this.keyword = value;
    this.page.index = 0;
    this.search();
  }

  search() {
    this.su.findSuOrganizes(this.keyword, this.page).subscribe(res => {
      this.organizes = res.rows;
      this.page.totalElements = res.count;
    });
  }

  addFunction() {
    this.router.navigate(['/su/surt01/detail']);
  }

  remove(code, version) {
    this.modal.confirm('message.STD00003')
      .subscribe(res => {
        if (res) {
          this.su.delete(code, version)
            .subscribe(() => {
              this.ms.success('message.STD00014');
              this.page = this.util.setPageIndex(this.page);
              this.search();
            });
        }
      });
  }
}
