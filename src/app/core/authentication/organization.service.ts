import { Injectable } from '@angular/core';
import { BehaviorSubject, Subscription, combineLatest } from 'rxjs';
import { map, switchMap, startWith, tap, filter, distinctUntilChanged } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { I18nService } from '../i18n.service';

@Injectable({ providedIn: 'root' })
export class OrganizationService {

  private companySource = new BehaviorSubject<string>(null);
  private divisionSource = new BehaviorSubject<string>(null);
  private companySubscription!: Subscription;
  private divisionSubscription!: Subscription;
  ready = new BehaviorSubject<boolean>(false);
  company = this.companySource.asObservable();
  division = this.divisionSource.asObservable();
  companies = [];
  divisions = [];
  constructor(
    private http: HttpClient,
    private i18n: I18nService
  ) {
    this.companySubscription = this.i18n.onLangChanged.pipe(
      startWith(null),
      switchMap(() => this.getCompanies())
    ).subscribe(companies => {
      this.companies = companies;
      if (this.companySource.getValue() == null) {
        this.updateCompany(this.findFirstOrDefaultCompany(companies));
      }
    })

    ///get new division list when lang changed or company code changed
    ///but update current division only when company changed
    this.divisionSubscription = combineLatest(this.i18n.onLangChanged.pipe(startWith(null)), this.company).pipe(
      filter(([lang,comp])=>comp != null),
      switchMap(([lang,comp]) => this.getDivisions(comp),([lang,comp],divisions)=>({comp,divisions})),
      tap(result=> this.divisions = result.divisions),
      distinctUntilChanged((pre,curr) => pre.comp === curr.comp),
    ).subscribe(result => {
      const currentDivision = result.divisions.length ? result.divisions[0].value : null;
      this.updateDivision(currentDivision);
      this.ready.next(true);
    })
  }

  private findFirstOrDefaultCompany(companies: any[]) {
    const companyOrder = [...companies];
    return companyOrder.length ? companyOrder.sort((a, b) => (a.default === b.default) ? 0 : a.default ? -1 : 1)[0].value : '';
  }

  private getCompanies() {
    return this.http.disableHeader().get<any>('personal/organization', { headers:{}, params: { name: 'company', lang: this.i18n.language } }).pipe(
      map(org => org.companies)
    )
  }

  updateCompany(value: string) {
    this.companySource.next(value);
  }

  private getDivisions(companyCode) {
    return this.http.disableHeader().get<any>('personal/organization', { headers:{},params: { name: 'division', companyCode: companyCode, lang: this.i18n.language } }).pipe(
      map(org => org.divisions)
    )
  }

  updateDivision(value: string) {
    this.divisionSource.next(value);
  }

  destroy(){
    if (this.companySubscription) this.companySubscription.unsubscribe();
    if (this.divisionSubscription) this.divisionSubscription.unsubscribe();
  }
}
