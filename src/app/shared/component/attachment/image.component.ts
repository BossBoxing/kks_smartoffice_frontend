import { Component, OnInit, Optional, Self, Input, ViewChild } from '@angular/core';
import { BaseFormField } from '../base-form';
import { NgControl } from '@angular/forms';
import { ContentUploadService, Content, Type, Path } from './content-upload.service';
import { finalize, map } from 'rxjs/operators';
import { HttpEvent, HttpEventType } from '@angular/common/http';
import { Category } from './category';
import { of } from 'rxjs';

@Component({
  selector: 'image',
  templateUrl: './image.component.html',
  styleUrls: ['./image.component.scss']
})
export class ImageComponent extends BaseFormField {

  errors = [];
  content: Content = {} as Content;
  progress: number;

  @Input() category: Category;
  @Input() max: number = 3000;
  @Input() dynamicWidth = false;
  @Input() disabled = false;
  @ViewChild('imgInput') fileInput;
  constructor(
    @Optional() @Self() public controlDir: NgControl,
    public cs: ContentUploadService,
  ) {
    super(controlDir);
  }

  get displayUrl(){
    if(this.content.id){
      return this.cs.pathObserv.pipe(
        map(path=>`${path.contentUrl}${this.content.path}`)
      )
    }
    else return of(this.content.path);
  }

  writeValue(id: number): void {
    if (id) {
      this.cs.getContent(id).subscribe(result => {
        this.content = result;
      })
    }
    else {
      this.content = {} as Content;
      // this.clear();
    }
    this.clearInternalError();
  }

  preview(attachment) {
    var reader = new FileReader();
    reader.readAsDataURL(attachment);
    reader.onload = (_event) => {
      this.content.path = reader.result;
    }
  }

  add(event) {
    this.clearInternalError();
    const file = event[0];
    if (!file) {
      return;
    }
    if (!this.isImage(file)) {
      this.errors.push("กรุณาเลือกไฟล์รูปเท่านั้น");
      this.setInternalError();
    }
    else if (this.isEmptySize(file)) {
      this.setInternalError();
      this.errors.push("ไม่พบเนื้อหา");
    }
    else if (this.isInvalidSize(file)) {
      this.errors.push("กรุณาเลือกไฟล์รูปขนาดไม่เกิน " + this.max + " KB");
      this.setInternalError();
    }

    if (this.errors.length === 0) {
      this.setInternalError();
      let attachment = event[0];
      this.preview(attachment);
      this.cs.upload(attachment, Type.Image, this.category).subscribe((event: HttpEvent<any>) => {
        switch (event.type) {
          case HttpEventType.UploadProgress:
            this.progress = Math.round(event.loaded / event.total * 100);
            break;
          case HttpEventType.Response:
            this.content = event.body;
            this.clearInternalError();
            this.onChange(this.content.id);
            break;
        }
      },err=>{
        this.errors.push("อัพโหลดไม่สำเร็จ กรุณาตรวจสอบการเชื่อมต่อ");
      })
    }
  }

  remove() {
    this.content = {} as Content;
    this.clear();
    this.onChange(null);
  }

  private isImage(file) {
    return file['type'].split('/')[0] == 'image';
  }

  private isEmptySize(file) {
    return file.size === 0;
  }

  private isInvalidSize(file) {
    return Math.round((file.size / 1024)) >= this.max;
  }

  private clear() {
    this.fileInput.nativeElement.value = '';
  }

  private setInternalError() {
    if (this.control)
      this.control.setErrors({ uploading: true });
  }

  private clearInternalError() {
    this.errors = [];
    if (this.control) {
      this.control.setErrors({ uploading: null });
      this.control.updateValueAndValidity({ onlySelf: false, emitEvent: false });
    }
  }
}
