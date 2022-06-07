import { Component } from '@angular/core';
import { ModalService, Size, RowState, LookupMultipleResult, BaseList } from '@app/shared';
import { LookupMultipleComponent } from './lookup-multiple/lookup-multiple.component';

@Component({
  selector: 'app-input-lookup',
  templateUrl: './input-lookup.component.html',
  styleUrls: ['./input-lookup.component.scss']
})
export class InputLookupComponent {

  demoItems = [
    { guid: '', categoryCode: '11', categoryNameTha: '11', rowState: RowState.Normal} as BaseList
  ];
  demoItemsDelete = [];
  lookupMultiple = LookupMultipleComponent;
  constructor(private modal: ModalService) { }

  addItems() {
     const initial = {
      selectedList: [...this.demoItems],
      deleteList: [...this.demoItemsDelete]
     };
     this.modal.openComponent(this.lookupMultiple, Size.large, initial).subscribe((list: LookupMultipleResult) => {
       if (list) {
         this.demoItems = [...list.selected];
         this.demoItemsDelete = [...list.deleting];
       }
     });
  }
}
