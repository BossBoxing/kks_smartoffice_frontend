import { Component } from '@angular/core';
import { SidebarService } from '../sidebar/sidebar.service';
import { I18nService, SupportedLanguages, AuthService, OrganizationService } from '@app/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent {

  thai = SupportedLanguages.Thai;
  eng = SupportedLanguages.Eng;

  constructor(
    public sidebarservice: SidebarService,
    private authService:AuthService,
    public orgService: OrganizationService,
    private router:Router,
    public i18n: I18nService) { }

  ngOnDestroy(){
    this.orgService.destroy();
  }
  
  toggleSidebar() {
    this.sidebarservice.setSidebarState(!this.sidebarservice.getSidebarState());
  }

  signOut() {
    this.authService.signout();
  }

  getCompanyName(code,companies:any[]){
    let current = companies.find(comp => comp.value === code);
    return current ? current.text : '';
  }

  getDivisionName(code,divisions:any[]){
    let current = divisions.find(div => div.value === code);
    return current ? current.text : '';
  }

  changeCompany(company,current){
     if(company !== current)
      this.router.navigate(['empty/comp',company])
  }

  changeDivision(division,current){
    if(division !== current)
      this.router.navigate(['empty/division',division])
  }
}
