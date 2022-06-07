import { Component, OnInit } from '@angular/core';
import Stepper from 'bs-stepper';

import {  ModalService, Size } from '@app/shared';
import { BsModalRef } from 'ngx-bootstrap';
 
@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss']
})
export class LayoutComponent implements OnInit {
  private stepper: Stepper;
  templatePopup : BsModalRef;

  constructor(public modal:ModalService) { }

  ngOnInit() {
    this.stepper = new Stepper(document.querySelector('#stepper1'), {
      linear: false,
      animation: true
    })
  }

  next() {
    this.stepper.next();
  }

  
  onTableEvent(){

  }
  confirm(){
    this.modal.confirm("message.STD00003").subscribe(result=>{
      if(result){
        console.log("yes");
      }
      else console.log("no");
    })
  }

  template(content){
    this.templatePopup = this.modal.open(content, Size.medium);
  }
  close(){
    this.templatePopup.hide();
  }
}
