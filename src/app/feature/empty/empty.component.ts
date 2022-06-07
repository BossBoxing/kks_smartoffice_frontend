import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { I18nService, AuthService, OrganizationService } from '@app/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-empty',
  templateUrl: './empty.component.html',
  styleUrls: ['./empty.component.scss']
})
export class EmptyComponent implements OnInit {

  private langChangedSubscription!: Subscription;

  constructor(
    private router: Router,
    private location: Location,
    private route: ActivatedRoute,
    private orgService: OrganizationService,
    public i18n: I18nService) { }

  ngOnInit() {
    if (this.router.url.includes('/lang')) {
      this.langChangedSubscription = this.i18n.onLangChanged.subscribe(() => this.location.back());
      const lang = this.route.snapshot.paramMap.get('code');
      this.i18n.language = lang;
    }
    else if (this.router.url.includes('/comp')) {
      const company = this.route.snapshot.paramMap.get('code');
      this.orgService.updateCompany(company);
      this.router.navigate(["/dashboard"]);
    }
    else if(this.router.url.includes('/division')){
      const division = this.route.snapshot.paramMap.get('code');
      this.orgService.updateDivision(division);
      this.router.navigate(["/dashboard"]);
    }
    else this.location.back();
  }

  ngOnDestroy() {
    if (this.langChangedSubscription) {
      this.langChangedSubscription.unsubscribe();
    }
  }
}
