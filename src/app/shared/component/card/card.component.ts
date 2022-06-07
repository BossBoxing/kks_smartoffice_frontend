import { Component, OnInit, Input } from '@angular/core';
import { trigger, state, style, transition, animate } from '@angular/animations';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss'],
  animations: [
    trigger('slide', [
      state('up', style({ height: 0,'padding-top': '0', 'padding-bottom': '0','overflow':'hidden' })),
      state('down', style({ height: '*' })),
      transition('up <=> down', animate(100))
    ])
  ]
})
export class CardComponent implements OnInit {
  @Input() header: string = '';
  @Input() collapsible: boolean = true;
  @Input() isCollapsed: boolean = false;
  constructor() { }

  ngOnInit() {
  }

  getState() {

    if (!this.isCollapsed) {
      return 'down';
    } else {
      return 'up';
    }
  }

  toggleCollaspe() {
    if (this.collapsible) {
      this.isCollapsed = !this.isCollapsed;
    }
  }
}
