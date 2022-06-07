import { Component, Optional, Self, Input, ViewChild } from '@angular/core';
import { BaseFormField } from '../base-form';
import { NgControl } from '@angular/forms';
import { I18nService } from '@app/core';
import { ContentUploadService, Content, Type } from './content-upload.service';
import { HttpEvent, HttpEventType } from '@angular/common/http';
import { finalize, map } from 'rxjs/operators';
import { Category } from './category';
import { of } from 'rxjs';

@Component({
  selector: 'attachment',
  templateUrl: './attachment.component.html',
  styleUrls: ['./attachment.component.scss']
})
export class AttachmentComponent extends BaseFormField {
  errors = [];
  content: Content = {} as Content;
  uploaded: boolean = false;
  progress: number;
  @Input() category: Category;
  @Input() max: number = 3000;
  // @ViewChild('fileInput') fileInput;
  @ViewChild('fileInput',{ static: true }) fileInput;
  @Input() fileType: string;
  constructor(
    @Optional() @Self() public controlDir: NgControl,
    private cs: ContentUploadService,
    public lang: I18nService
  ) { super(controlDir) }

  get displayUrl(){
    if(this.content.id){
      return this.cs.pathObserv.pipe(
        map(path=>`${path.contentUrl}${this.content.path}`)
      )
    }
    else return of(this.content.path);
  }

  ngOnInit(){
    if (this.fileType) {
      this.fileType = this.fileType.replace(/\s/g, '').split(',').map(type => {
        if (type.substring(0, 1) != '.') return `.${type}`;
        else return type;
      }).join(',');
    }
  }

  writeValue(id: number): void {
    this.uploaded = false;
    if (id) {
      this.cs.getContent(id).subscribe(result => {
        this.content = result;
        this.uploaded = true;
      })
    }
    else {
      this.content = {} as Content;
      this.clear();
    }
    this.clearInternalError();
  }
  add(event) {
    const file = event[0];
    this.clearInternalError();
    if (!file) {
      return;
    }
    this.uploaded = false;

    if (this.isEmptySize(file)) {
      this.setInternalError();
      this.errors.push("ไม่พบเนื้อหา");
    } else if (this.isInvalidSize(file)) {
      this.setInternalError();
      this.errors.push("กรุณาเลือกไฟล์ขนาดไม่เกิน " + this.max + " KB");
    } else if (this.isInvalidFileType(file)) {
      this.setInternalError();
      this.errors.push("กรุณาเลือกไฟล์ประเภท " + this.fileType.split(',').join(', ') + " เท่านั้น");
    }

    if (this.errors.length === 0) {
      let attachment = event[0];
      this.content.name = attachment.name;
      this.setInternalError();
      this.cs.upload(attachment, Type.File, this.category).subscribe((event: HttpEvent<any>) => {
        switch (event.type) {
          case HttpEventType.UploadProgress:
            this.progress = Math.round(event.loaded / event.total * 100);
            break;
          case HttpEventType.Response:
            this.content = event.body;
            this.uploaded = true;
            this.clearInternalError();
            this.onChange(this.content.id);
            break;
        }
      },err=>{
        this.errors.push("อัพโหลดไม่สำเร็จ กรุณาตรวจสอบการเชื่อมต่อ");
      })
    }
  }

  protected isInvalidFileType(file) {
    if (!this.fileType) return false;
    let name = file.name.split('.');
    let type = this.fileType.split(',');
    return type.every(type => type != `.${name[name.length - 1]}`);
  }

  protected isEmptySize(file) {
    return file.size === 0;
  }

  protected isInvalidSize(file) {
    return Math.round((file.size / 1024)) >= this.max;
  }

  protected clear() {
    this.fileInput.nativeElement.value = '';
  }

  protected setInternalError() {
    if (this.control)
      this.control.setErrors({ uploading: true });
  }

  protected clearInternalError() {
    this.errors = [];
    if (this.control) {
      this.control.setErrors({ uploading: null });
      this.control.updateValueAndValidity({ onlySelf: false, emitEvent: false });
    }
  }

  open() {
    this.displayUrl.subscribe(display=>{
      window.open(display as string, '_blank');
    })
  }

  remove() {
    this.onChange(null);
    this.content = {} as Content;
    this.clear();
    this.control.reset();
  }
}
