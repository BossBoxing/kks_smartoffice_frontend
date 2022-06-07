import { Component, OnDestroy, OnInit } from '@angular/core';
import { Surt03Service } from './surt03.service';
import { Page, ModalService, FormUtilService } from '@app/shared';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService, SaveDataService } from '@app/core';

@Component({
  selector: 'app-surt03',
  templateUrl: './surt03.component.html'
})
export class Surt03Component implements OnInit, OnDestroy {
  public static readonly programCode = 'surt03';
  page = new Page();
  keyword = '';
  menus = [];
  permission = {
    isReadOnly: null
  };

  constructor(
    private su: Surt03Service,
    private route: ActivatedRoute,
    private router: Router,
    private modal: ModalService,
    private ms: MessageService,
    private util: FormUtilService,
    private saver: SaveDataService
  ) { }

  ngOnInit() {
    this.route.data.subscribe((data) => {
      const saveData = this.saver.retrive('surt03');
      if (saveData) { this.keyword = saveData; }
      const savePage = this.saver.retrive('surt03Page');
      if (savePage) { this.page = savePage; }
      this.search();
    });
  }

  ngOnDestroy() {
    this.saver.save(this.keyword, 'surt03');
    this.saver.save(this.page, 'surt03Page');
  }

  enter(value) {
    this.keyword = value;
    this.page.index = 0;
    this.search();
  }

  search() {
    this.su.findMenus(this.keyword, this.page)
      .pipe()
      .subscribe(res => {
        this.menus = res.rows;
        this.page.totalElements = res.count;
      });
  }

  addFunction() {
    this.router.navigate(['/su/surt03/detail']);
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
