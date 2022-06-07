import { Injectable, Component, ComponentFactoryResolver, Type, Injector } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { ConfirmComponent } from './confirm/confirm.component';
import { ModalResolve } from './modal-resolver';
import { switchMap } from 'rxjs/operators';


export enum Size {
  small = "modal-sm",
  medium = "",
  large = "modal-lg",
  xlarge = "modal-xl"
}

@Injectable()
export class ModalService {

  constructor(
    private injector: Injector,
    private bsModalService: BsModalService
  ) { }

  confirm(message: string, size?: Size, keyboard = true): Observable<boolean> {
    const initialState = {
      message: message
    };
    const modal = this.bsModalService.show(ConfirmComponent, { initialState, ignoreBackdropClick: true, class: size, keyboard: keyboard });
    return modal.content.selected;
  }

  //templateRef
  open(content, size?: Size, initialState?: Object, keyboard = true) {
    const modal = this.bsModalService.show(content, { initialState, ignoreBackdropClick: true, class: size, keyboard: keyboard });
    return modal;
  }

  //component
  openComponent(content, size?: Size, initialObject?: Object, resolver?: any, resolverParam?: any, keyboard = true): Observable<any> {
    const initialState = initialObject || {};
    if (resolver) {
      const instant = this.injector.get(resolver) as ModalResolve<any>;
      return instant.resolve(resolverParam).pipe(
        switchMap((result) => {
          initialState['resolved'] = result;
          const modal = this.bsModalService.show(content, { initialState, ignoreBackdropClick: true, class: size, keyboard: keyboard });
          return modal.content.selected.asObservable();
        })
      )
    }
    else {
      const modal = this.bsModalService.show(content, { initialState, ignoreBackdropClick: true, class: size, keyboard: keyboard });
      return modal.content.selected.asObservable();
    }
  }
}