import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { FormUtilService, ModalService } from '@app/shared';
import { CanComponentDeactivate, MessageService } from '@app/core';
import { BasicForm } from '@app/shared/component/base-form';
import { Observable, of } from 'rxjs';
import { CommonConstants } from '@app/feature/common/common-constants';
import { finalize, switchMap } from 'rxjs/operators';
import { PlCustomer, Plrt01Service } from '../plrt01.service';
import { Permission } from '@app/shared/service/permission.service';

@Component({
  selector: 'app-plrt01-detail',
  templateUrl: './plrt01-detail.component.html',
  styleUrls: ['./plrt01-detail.component.scss']
})
export class Plrt01DetailComponent implements OnInit, CanComponentDeactivate, BasicForm {
  plCustomForm!: FormGroup;
  permission = {} as Permission;
  plCustomer: PlCustomer;
  saving = false;
  param: any = this.router.getCurrentNavigation()?.extras.state;

  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    public util: FormUtilService,
    private router: Router,
    private ms: MessageService,
    private modal: ModalService,
    private pl: Plrt01Service
  ) { }

  ngOnInit() {
    this.createForm();
    this.route.data.subscribe((data) => {
      this.permission = data.plrt01.permission;
      this.plCustomer = data.plrt01.detail;
      this.rebuildForm();
    });
    this.installEvent();
  }

  createForm() {
    this.plCustomForm = this.fb.group({
      custCode: [null, [Validators.required, Validators.maxLength(6)]],
      custName: [null, [Validators.required, Validators.maxLength(60)]],
      shortName: [null, [Validators.maxLength(5)]],
      custContact: [null, [Validators.maxLength(60)]],
      areaCode: [null, [Validators.maxLength(4)]],
      address: [null, [Validators.maxLength(200)]],
      telNo: [null, [Validators.required, Validators.maxLength(20)]],
      faxNo: [null, [Validators.maxLength(20)]],
      countryCode: [null, [Validators.maxLength(3)]],
      effectiveDate: [null, [Validators.required]],
      hardwareSpec: [null, [Validators.maxLength(60)]],
      osSpec: [null, [Validators.maxLength(60)]],
      toolDev: [null, [Validators.maxLength(60)]],
      remark: [null, [Validators.maxLength(200)]],
      active: [CommonConstants.Status.Active],
      color: null,
      activeBool: true,
      rowVersion: null
    });
  }

  rebuildForm() {
    this.plCustomForm.markAsPristine();
    if (this.plCustomer.custCode) {
      console.log(this.plCustomer);
      this.plCustomer.activeBool = this.plCustomer.active === CommonConstants.Status.Active;
      this.plCustomForm.patchValue(this.plCustomer);
      this.plCustomForm.controls.custCode.disable({ emitEvent: false });
    }
    this.plCustomForm.markAsPristine();
  }

  installEvent() {
    this.plCustomForm.controls.activeBool.valueChanges.subscribe((activeBool) => {
      if (this.plCustomForm.controls.activeBool.dirty) {
        this.plCustomForm.controls.active.setValue(activeBool ? CommonConstants.Status.Active : CommonConstants.Status.Inactive);
      }
    });
  }

  save() {
    if (this.isFormValid()) {
      this.saving = true;
      this.pl.save(this.plCustomer, this.plCustomForm.getRawValue()).pipe(
        switchMap(result => this.pl.findplCustomerByKey(result.custCode)),
        finalize(() => this.saving = false)
      ).subscribe((result) => {
        this.plCustomer = result;
        this.rebuildForm();
        this.ms.success('message.STD00006');
      });
    }
  }

  isFormValid(): boolean {
    return this.util.isFormGroupValid(this.plCustomForm);
  }

  isFormDirty(): boolean {
    return this.plCustomForm.dirty;
  }

  canDeactivate(): Observable<boolean> {
    if (!this.isFormDirty()) {
      return of(true);
    }
    return this.modal.confirm('message.STD00002');
  }

}
