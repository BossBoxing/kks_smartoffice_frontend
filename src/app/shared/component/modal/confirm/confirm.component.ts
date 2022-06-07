import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap';

@Component({
  selector: 'app-confirm',
  templateUrl: './confirm.component.html',
  styleUrls: ['./confirm.component.scss']
})
export class ConfirmComponent {
  message: string;
  options: string[];
  @Output() selected = new EventEmitter<boolean>();
  constructor(
    public bsModalRef: BsModalRef,
  ) { }

  confirm(): void {
   this.selected.emit(true);
    this.bsModalRef.hide();
  }

  decline(): void {
    this.selected.emit(false);
    this.bsModalRef.hide();
  }
}
