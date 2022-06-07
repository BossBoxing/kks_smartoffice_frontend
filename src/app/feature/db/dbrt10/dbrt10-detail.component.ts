import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable, of } from 'rxjs';
import { switchMap, finalize } from 'rxjs/operators';
import { FormUtilService, ModalService } from '@app/shared';
import { CanComponentDeactivate, MessageService } from '@app/core';
import { DbPosition, Dbrt10Service } from './dbrt10.service';
import { BasicForm } from '@app/shared/component/base-form';
import { CommonConstants } from '@app/feature/common/common-constants';
import { Permission } from '@app/shared/service/permission.service';


@Component({
  selector: 'app-dbrt10-detail',
  templateUrl: './dbrt10-detail.component.html',
  styleUrls: ['./dbrt10-detail.component.scss']
})
export class Dbrt10DetailComponent implements OnInit, CanComponentDeactivate, BasicForm {
  dbPositionForm: FormGroup;
  dbPosition: DbPosition = {} as DbPosition;
  saving = false;
  permission = {} as Permission;
  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    public util: FormUtilService,
    private ms: MessageService,
    private modal: ModalService,
    private db: Dbrt10Service
  ) { }

  ngOnInit() {
    this.createForm();
    this.route.data.subscribe((data) => {
      this.permission = data.dbrt10.permission;
      this.dbPosition = data.dbrt10.detail;
      this.rebuildForm();
    });
    this.installEvent();
  }
  createForm() {
    this.dbPositionForm = this.fb.group({
      positionCode: [null , [Validators.required, Validators.maxLength(10)]],
      positionNameTha: [null , [Validators.required, Validators.maxLength(50)]],
      positionNameEng: [null , [Validators.maxLength(50)]],
      active: CommonConstants.Status.Active,
      activeBool: true,
      rowVersion: null
    });
  }

  rebuildForm() {
    if (this.dbPosition.positionCode ) {
      this.dbPosition.activeBool = this.dbPosition.active === CommonConstants.Status.Active;
      this.dbPositionForm.patchValue(this.dbPosition);
      this.dbPositionForm.controls.positionCode.disable({emitEvent: false});
    }
    if (this.permission.isReadOnly) {
      this.dbPositionForm.disable({emitEvent: false});
    }
    this.dbPositionForm.markAsPristine();
  }

  installEvent() {
    this.dbPositionForm.controls.activeBool.valueChanges.subscribe((activeBool) => {
      if (this.dbPositionForm.controls.activeBool.dirty) {
        this.dbPositionForm.controls.active.setValue(activeBool ? CommonConstants.Status.Active : CommonConstants.Status.Inactive);
      }
    });
  }

  save() {
    if (this.isFormValid()) {
      this.saving = true;
      this.db.save(this.dbPosition , this.dbPositionForm.getRawValue()).pipe(
        switchMap(result => this.db.findDbPositionByKey(result.positionCode)),
        finalize(() => this.saving = false)
      ).subscribe((result) => {
        this.dbPosition = result;
        this.rebuildForm();
        this.ms.success('message.STD00006');
      });
    }
  }

  isFormValid(): boolean {
    return this.util.isFormGroupValid(this.dbPositionForm);
  }

  isFormDirty(): boolean {
    return this.dbPositionForm.dirty;
  }

  canDeactivate(): Observable<boolean> {
    if (!this.isFormDirty()) {
      return of(true);
    }
    return this.modal.confirm('message.STD00002'); // ละทิ้งการเปลี่ยนแปลงหรือไม่
  }

}
