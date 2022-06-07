import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable, of } from 'rxjs';
import { switchMap, finalize } from 'rxjs/operators';
import { FormUtilService, ModalService } from '@app/shared';
import { CanComponentDeactivate, MessageService } from '@app/core';
import { Dbrt04Service, DbCountry } from './dbrt04.service';
import { BasicForm } from '@app/shared/component/base-form';
import { CommonConstants } from '@app/feature/common/common-constants';
import { Permission } from '@app/shared/service/permission.service';


@Component({
  selector: 'app-dbrt04-detail',
  templateUrl: './dbrt04-detail.component.html',
  styleUrls: ['./dbrt04-detail.component.scss']
})
export class Dbrt04DetailComponent implements OnInit, CanComponentDeactivate, BasicForm {
  dbCountryForm: FormGroup;
  dbCountry: DbCountry = {} as DbCountry;
  permission = {} as Permission;
  saving = false;

  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    public util: FormUtilService,
    private ms: MessageService,
    private modal: ModalService,
    private db: Dbrt04Service
  ) { }

  ngOnInit() {
    this.createForm();
    this.route.data.subscribe((data) => {
      this.permission = data.dbrt04.permission;
      this.dbCountry = data.dbrt04.detail;
      this.rebuildForm();
    });
    this.installEvent();
  }

  createForm() {
    this.dbCountryForm = this.fb.group({
      countryCode: [null , [Validators.required, Validators.maxLength(10)]],
      countryNameTha: [null , [Validators.required, Validators.maxLength(50)]],
      countryNameEng: [null , [Validators.required, Validators.maxLength(50)]],
      active: 'Y',
      activeBool: true,
      rowVersion: null
    });
  }

  rebuildForm() {
    this.dbCountryForm.markAsPristine();
    if (this.dbCountry.countryCode) {
      this.dbCountry.activeBool = this.dbCountry.active === CommonConstants.Status.Active;
      this.dbCountryForm.patchValue(this.dbCountry);
      this.dbCountryForm.controls.countryCode.disable({emitEvent: false});
    }
    if (this.permission.isReadOnly) {
      this.dbCountryForm.disable({emitEvent: false});
    }
    this.dbCountryForm.markAsPristine();
  }

  installEvent() {
    this.dbCountryForm.controls.activeBool.valueChanges.subscribe((activeBool) => {
      if (this.dbCountryForm.controls.activeBool.dirty) {
        this.dbCountryForm.controls.active.setValue(activeBool ? CommonConstants.Status.Active : CommonConstants.Status.Inactive);
      }
    });
  }

  save() {
    if (this.isFormValid()) {
      this.saving = true;
      this.db.save(this.dbCountry , this.dbCountryForm.getRawValue()).pipe(
        switchMap(result => this.db.findDbCountryByKey(result.countryCode)),
        finalize(() => this.saving = false)
      ).subscribe((result) => {
        this.dbCountry = result;
        this.rebuildForm();
        this.ms.success('message.STD00006');
      });
    }
  }

  isFormValid(): boolean {
    return this.util.isFormGroupValid(this.dbCountryForm);
  }

  isFormDirty(): boolean {
    return this.dbCountryForm.dirty;
  }

  canDeactivate(): Observable<boolean> {
    if (!this.isFormDirty()) {
      return of(true);
    }
    return this.modal.confirm('message.STD00002'); // ละทิ้งการเปลี่ยนแปลงหรือไม่
  }
}
