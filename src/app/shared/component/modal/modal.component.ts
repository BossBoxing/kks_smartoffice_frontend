import { Component, OnInit, Input, EventEmitter, Output, HostListener } from '@angular/core';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss']
})
export class ModalComponent {

  @Input() header: string;
  @Input() escape = true;
  @Input() parameter: any = {};
  @Output() passEntry: EventEmitter<any> = new EventEmitter();
  @Output() onClose = new EventEmitter();
  constructor() { }
  close() {
    this.onClose.emit();
  }

  @HostListener('document:keydown.escape', ['$event']) onKeydownHandler(event: KeyboardEvent) {
    if (this.escape) { this.onClose.emit(); }
  }
}
