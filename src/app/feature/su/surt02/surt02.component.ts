import { Component, OnDestroy, OnInit } from '@angular/core';
import { Surt02Service } from './surt02.service';
import { Page, ModalService, FormUtilService } from '@app/shared';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService, SaveDataService } from '@app/core';

@Component({
  selector: 'app-surt02',
  templateUrl: './surt02.component.html'
})
export class Surt02Component implements OnInit, OnDestroy {
  public static readonly programCode = 'surt02';
  page = new Page();
  keyword = '';
  programs = [];
  permission = {
    isReadOnly: null
  };

  constructor(
    private su: Surt02Service,
    private route: ActivatedRoute,
    private router: Router,
    private modal: ModalService,
    private ms: MessageService,
    private util: FormUtilService,
    private saver: SaveDataService
  ) { }

  ngOnInit() {
    this.route.data.subscribe((data) => {
      const saveData = this.saver.retrive('surt02');
      if (saveData) {
        this.keyword = saveData;
      }
      const savePage = this.saver.retrive('surt02Page');
      if (savePage) {
        this.page = savePage;
      }
      this.search();
    });
  }

  ngOnDestroy() {
    this.saver.save(this.keyword, 'surt02');
    this.saver.save(this.page, 'surt02Page');
  }

  enter(value) {
    this.keyword = value;
    this.page.index = 0;
    this.search();
  }

  search() {
    this.su.findSuPrograms(this.keyword, this.page)
    .subscribe(res => {
      this.programs = res.rows;
      this.page.totalElements = res.count;
    });
  }

  addFunction() {
    this.router.navigate(['/su/surt02/detail']);
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
