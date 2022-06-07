import { Component, OnDestroy, OnInit } from '@angular/core';
import { Surt04Service } from './surt04.service';
import { Page, ModalService, FormUtilService } from '@app/shared';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService, SaveDataService } from '@app/core';

@Component({
  selector: 'app-surt04',
  templateUrl: './surt04.component.html'
})
export class Surt04Component implements OnInit , OnDestroy {
  public static readonly programCode = 'surt04';
  page = new Page();
  keyword = '';
  profiles = [];
  permission = {
    isReadOnly: null
  };

  constructor(
    private su: Surt04Service,
    private route: ActivatedRoute,
    private router: Router,
    private modal: ModalService,
    private ms: MessageService,
    private util: FormUtilService,
    private saver: SaveDataService
  ) { }

  ngOnInit() {
    this.route.data.subscribe((data) => {
      const saveData = this.saver.retrive('surt04');
      if (saveData) {
        this.keyword = saveData;
      }
      const savePage = this.saver.retrive('surt04Page');
      if (savePage) {
        this.page = savePage;
      }
      this.search();
    });
  }

  ngOnDestroy() {
    this.saver.save(this.keyword, 'surt04');
    this.saver.save(this.page, 'surt04Page');
  }

  enter(value) {
    this.keyword = value;
    this.page.index = 0;
    this.search();
  }

  search() {
    this.su.findSuProfiles(this.keyword, this.page)
    .subscribe(res => {
      this.profiles = res.rows;
      this.page.totalElements = res.count;
    });
  }

  addFunction() {
    this.router.navigate(['/su/surt04/detail']);
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
