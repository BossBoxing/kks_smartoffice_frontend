import { Component, OnInit } from '@angular/core';
import { trigger, state, style, transition, animate, query, group, animateChild } from '@angular/animations';
import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';

import { SidebarService, ScreenSize } from './sidebar/sidebar.service';
import { RouterOutlet } from '@angular/router';
import { environment } from '@env/environment';
import { Observable } from 'rxjs';
 

@Component({
  selector: 'app-shell',
  templateUrl: './shell.component.html',
  styleUrls: ['./shell.component.scss'],
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
  ]
})
export class ShellComponent implements OnInit {

  constructor(public breakpointObserver: BreakpointObserver, public sidebarservice: SidebarService) { }
  isMediumScreen:Observable<boolean>;
  timestamp = new Date(environment.timeStamp);
  ngOnInit() {
    this.isMediumScreen = this.sidebarservice.isMediumScreenObserv;
  }
  getSideBarState() {
    return this.sidebarservice.getSidebarState();
  }
  toggleSidebar() {
    this.sidebarservice.setSidebarState(!this.sidebarservice.getSidebarState());
  }
  prepareRoute(outlet: RouterOutlet) {
    return outlet && outlet.activatedRouteData;
  }
}
