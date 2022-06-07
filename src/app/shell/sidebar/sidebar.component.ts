import { Component, OnInit } from '@angular/core';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { SidebarService, Menu } from './sidebar.service';
import { finalize, startWith, switchMap, map } from 'rxjs/operators';
import { AuthService, I18nService } from '@app/core';
import { Observable, Subscription } from 'rxjs';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
  animations: [
    trigger('fadeAnimation', [
      state('in', style({ opacity: 1 })),
      transition('void => *', [
        style({ opacity: 0 }),
        animate(200)
      ]),
      transition('* => void', [
        animate(200, style({ opacity: 0 }))
      ])
    ])
  ],

})
export class SidebarComponent implements OnInit {
  loading = true;
  menus: Menu[];
  personalName: Observable<string>;
  userName: Observable<string>;
  menuSub?: Subscription;
  isMediumScreen = false;
  isMediumScreenSub?:Subscription;
  constructor(
    public sidebarservice: SidebarService,
    public authService: AuthService,
    private i18n: I18nService
  ) {
  }

  ngOnInit() {

    this.menuSub = this.sidebarservice.getMenuList().pipe(
      finalize(() => this.loading = false)
    ).subscribe(menus => this.menus = menus);

    this.personalName = this.i18n.onLangChanged.pipe(
      startWith(null),
      switchMap(() => this.authService.personalInfo),
      map(info => info.personalName || 'anonymous')
    );

    this.userName = this.authService.claims.pipe(
      map(claim => claim.name)
    );

    this.isMediumScreenSub = this.sidebarservice.isMediumScreenObserv.subscribe(medium=>this.isMediumScreen = medium);
  }

  ngOnDestory() {
    if (this.menuSub) this.menuSub.unsubscribe();
    if(this.isMediumScreenSub) this.isMediumScreenSub.unsubscribe();
  }

  getSideBarState() {
    return this.sidebarservice.getSidebarState();
  }

  toggle(currentMenu: Menu, level) {
    if (currentMenu.subMenus.length && level == 1) {
      this.menus.forEach(element => {
        if (element === currentMenu) {
          currentMenu.active = !currentMenu.active;
        } else {
          element.active = false;
        }
      });
    }
    else {
      if (currentMenu.subMenus.length && level > 1) {
        currentMenu.active = !currentMenu.active;
      }
    }
  }

  hide(){
    if(this.isMediumScreen){
      this.sidebarservice.toggle();
    }
  }

  haveChildren(menu: Menu) {
    return menu.subMenus && menu.subMenus.length > 0;
  }

  hasBackgroundImage() {
    return this.sidebarservice.hasBackgroundImage;
  }

  signOut() {
    this.authService.signout();
  }
}
