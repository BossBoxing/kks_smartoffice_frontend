import { Component } from '@angular/core';
import { AttachmentComponent } from '../attachment/attachment.component';

@Component({
  selector: 'import',
  templateUrl: './import.component.html',
  styleUrls: ['../attachment/attachment.component.scss']
})
export class ImportComponent extends AttachmentComponent {
  writeValue() {}
  async add(event) {
    this.uploaded = false;
    const file = event[0];
    this.clearInternalError();
    if (!file) {
      return;
    }
    if (this.isInvalidSize(file)) {
      this.setInternalError();
      this.errors.push("กรุณาเลือกไฟล์ขนาดไม่เกิน " + this.max + " KB");
    }
    if (this.errors.length === 0) {
      let attachment = event[0];
      this.content.name = attachment.name;
      this.setInternalError();
      this.control.setValue(attachment)
    }
  }
}
