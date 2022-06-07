import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { CanComponentDeactivate, MessageService } from '@app/core';
import { CommonConstants } from '@app/feature/common/common-constants';
import { FormUtilService, ModalService } from '@app/shared';
import { BasicForm } from '@app/shared/component/base-form';
import { Observable, of } from 'rxjs';
import { finalize, switchMap } from 'rxjs/operators';
import { TnIdpTransMaster, Tndt01Service } from '../tndt01.service';

@Component({
  selector: 'app-tndt01-detail',
  templateUrl: './tndt01-detail.component.html',
  styleUrls: ['./tndt01-detail.component.scss']
})
export class Tndt01DetailComponent implements OnInit, CanComponentDeactivate, BasicForm {
  transMasterForm: FormGroup;
  transMaster: TnIdpTransMaster = {} as TnIdpTransMaster;
  saving = false;
  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private db: Tndt01Service,
    public util: FormUtilService,
    private ms: MessageService,
    private modal: ModalService
  ) { }

  month = [
    { id: 1, name: 'มกราคม' },
    { id: 2, name: 'กุมภาพันธ์' },
    { id: 3, name: 'มีนาคม' },
    { id: 4, name: 'เมษายน' },
    { id: 5, name: 'พฤษภาคม' },
    { id: 6, name: 'มิถุนายน' },
    { id: 7, name: 'กรกฏาคม' },
    { id: 8, name: 'สิงหาคม' },
    { id: 9, name: 'กันยายน' },
    { id: 10, name: 'ตุลาคม' },
    { id: 11, name: 'พฤศจิกายน' },
    { id: 12, name: 'ธันวาคม' },
  ];
  inputMonth1: any = new FormControl(1); // A Form
  inputMonth2: any = new FormControl(6); // B Form 
  month2: any = this.month;
  selectMonth = [];

  ngOnInit() {
    this.createForm();
    const month1 = this.month;
    console.log(month1);
    this.inputMonth1.valueChanges.subscribe((input: any) => {
      if (this.inputMonth1.dirty) {
        if (input) {
          this.month2 = this.month.filter((row: any) => row.id >= input);
          this.inputMonth2.setValue(input);
        }
      }
    });

    this.route.data.subscribe((data) => {
      this.transMaster = data.tndt01.detail;
      this.rebuildForm();
    });
    this.installEvent();
    console.log(this.transMaster);
  }

  createForm() {
    this.transMasterForm = this.fb.group({
      transNo: [null, [Validators.required, Validators.maxLength(5)]],
      transYear: [null, [Validators.required, Validators.maxLength(30)]],
      transPeriod: [null, [Validators.required, Validators.maxLength(30)]],
      commitDate: [null, [Validators.required, Validators.maxLength(30)]],
      status: [null, [Validators.required, Validators.maxLength(30)]],
      titleIniTha: [null, [Validators.required, Validators.maxLength(30)]],
      titleIniEng: [null, [Validators.required, Validators.maxLength(30)]],
      suffixIniTha: [null, [Validators.required, Validators.maxLength(30)]],
      suffixIniEng: [null, [Validators.required, Validators.maxLength(30)]],
      active: CommonConstants.Status.Active,
      activeBool: true,
      rowVersion: null
    });
  }

  rebuildForm() {
    this.transMasterForm.markAsPristine();
    /*if (this.dbTitle.titleCode) {
      this.dbTitle.activeBool = this.dbTitle.active === CommonConstants.Status.Active;
      this.transMasterForm.patchValue(this.dbTitle);
      this.transMasterForm.controls.titleCode.disable({ emitEvent: false });
    }*/
    this.transMasterForm.markAsPristine();
  }

  installEvent() {
    this.transMasterForm.controls.activeBool.valueChanges.subscribe((activeBool) => {
      if (this.transMasterForm.controls.activeBool.dirty) {
        this.transMasterForm.controls.active.setValue(activeBool ? CommonConstants.Status.Active : CommonConstants.Status.Inactive);
      }
    });
  }

  save() {
    if (this.isFormValid()) {
      this.saving = true;
      this.db.save(this.transMaster, this.transMasterForm.getRawValue()).pipe(
        switchMap(result => this.db.findTnIdpTransByKey(result.transNo)),
        finalize(() => this.saving = false)
      ).subscribe((result) => {
        this.transMaster = result;
        this.rebuildForm();
        this.ms.success('message.STD00006');
      });
    }
  }

  isFormValid(): boolean {
    return this.util.isFormGroupValid(this.transMasterForm);
  }

  isFormDirty(): boolean {
    return this.transMasterForm.dirty;
  }

  canDeactivate(): Observable<boolean> {
    if (!this.isFormDirty()) {
      return of(true);
    }
    return this.modal.confirm('message.STD00002');
  }

}
