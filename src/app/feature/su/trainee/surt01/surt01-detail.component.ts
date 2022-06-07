import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { CanComponentDeactivate, MessageService } from '@app/core';
import { CommonConstants } from '@app/feature/common/common-constants';
import { FormUtilService, ModalService } from '@app/shared';
import { BasicForm } from '@app/shared/component/base-form';
import { Observable, of } from 'rxjs';
import { finalize, switchMap } from 'rxjs/operators';
import { SuUser, Surt01Service } from './surt01.service';

@Component({
  selector: 'app-surt01-detail',
  templateUrl: './surt01-detail.component.html',
  styleUrls: ['./surt01-detail.component.scss']
})

export class Surt01DetailComponent implements OnInit, CanComponentDeactivate , BasicForm {
  suUser: SuUser;
  suUserForm!: FormGroup;
  saving = false;
  workStartDate: Date;
  workEndDate: Date;
  genderItems = [
    { value: '-', text: 'ไม่ระบุ', description: '', active: true },
    { value: 'M', text: 'ผู้ชาย', description: 'description1', active: true },
    { value: 'F', text: 'ผู้หญิง', description: 'description2', active: true },
  ];
  constructor(
    private route: ActivatedRoute,
    public util: FormUtilService,
    private modal: ModalService,
    private fb: FormBuilder,
    private service: Surt01Service,
    private ms: MessageService,
  ) { }

  ngOnInit(): void {
    this.createForm();
    this.genderItems = this.util.getActive(this.genderItems, null);
    this.route.data.subscribe((data) => {
      this.suUser = data.surt01.detail;
      this.rebuildForm();
    });
    this.installEvent();
  }

  createForm() {
    this.suUserForm = this.fb.group({
      id: [null , [Validators.required]], // userId > id
      userName: [null , [Validators.required, Validators.maxLength(20)]],
      empId: [null , [Validators.required, Validators.maxLength(10)]],
      status: null ,
      sex: [null , Validators.maxLength(1)],
      age: [0 , Validators.maxLength(10)],
      preNameId: [ null, [ Validators.maxLength(3)]], // ID > Id
      tFirstName: [ null, [Validators.maxLength(40)]],
      tLastName: [ null, [Validators.maxLength(40)]],
      eFirstName: [ null, [Validators.maxLength(40)]],
      eLastName: [ null, [Validators.maxLength(40)]],
      birthday: null,
      address: [null, [Validators.maxLength(300)]],
      telephone: [null, [Validators.maxLength(20), Validators.pattern('^[0-9]*$')]],
      email: [null, [Validators.maxLength(100), Validators.email]],
      position: [null, [Validators.required, Validators.maxLength(5)]],
      typeId: [null, [Validators.required, Validators.maxLength(3)]],
      personalDate: [null, [Validators.required]],
      personalExpDate: null,
      active: CommonConstants.Status.Active,
      activeBool: true,
      rowVersion: null
    });
  }

  installEvent() {
    this.suUserForm.controls.activeBool.valueChanges.subscribe((activeBool) => {
      if (this.suUserForm.controls.activeBool.dirty) {
        this.suUserForm.controls.active.setValue(activeBool ? CommonConstants.Status.Active : CommonConstants.Status.Inactive);
      }
    });

    this.suUserForm.controls.position.valueChanges.subscribe((position) => {
      if (this.suUserForm.controls.position.dirty) {
        this.suUserForm.controls.position.setValue(this.suUserForm.controls.position.value);
      }
    });
  }

  save() {
    if (this.isFormValid()) {
      this.saving = true;
      this.service.save(this.suUser , this.suUserForm.getRawValue()).pipe(
        switchMap(result => this.service.findsuUserByKey(result.id, result.empId)),
        finalize(() => this.saving = false)
      ).subscribe((result) => {
        this.suUser.rows[0] = result.rows[0];
        this.rebuildForm();
        this.ms.success('message.STD00006');
      });
    }
  }

  rebuildForm() {
    this.suUserForm.markAsPristine();
    if (this.suUser.rows[0]) {
      this.suUser.activeBool = this.suUser.Active === CommonConstants.Status.Active;
      this.suUserForm.patchValue(this.suUser.rows[0]);
      this.workStartDate = this.suUser.rows[0].personalDate;
      this.workEndDate = this.suUser.rows[0].personalExpDate;
      this.suUserForm.controls.id.disable({emitEvent: false});
      this.suUserForm.controls.empId.disable({emitEvent: false});
    }
    this.suUserForm.markAsPristine();
  }

  onSearchGetPreNameFromId = (Keyword, value) => {
    return this.service.findPreNameIdForAtc(Keyword, value);
  }

  onSearchGetPosition = (Keyword, value) => {
    return this.service.findPositionForAtc(Keyword, value);
  }

  onSearchGetEmpType = (Keyword, value) => {
    return this.service.findEmpTypeForAtc(Keyword, value);
  }

  isFormValid(): boolean {
    return this.util.isFormGroupValid(this.suUserForm);
  }

  isFormDirty(): boolean {
    return this.suUserForm.dirty;
  }

  canDeactivate(): Observable<boolean> {
    if (!this.isFormDirty()) {
      return of(true);
    }
    return this.modal.confirm('message.STD00002');
  }

}
