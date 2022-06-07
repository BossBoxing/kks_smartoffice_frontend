import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable, of } from 'rxjs';
import { switchMap, finalize } from 'rxjs/operators';
import { FormUtilService, ModalService } from '@app/shared';
import { CanComponentDeactivate, MessageService } from '@app/core';
import { DbRace, Dbrt07Service } from './dbrt07.service';
import { BasicForm } from '@app/shared/component/base-form';
import { CommonConstants } from '@app/feature/common/common-constants';
import { Permission } from '@app/shared/service/permission.service';


@Component({
  selector: 'app-dbrt07-detail',
  templateUrl: './dbrt07-detail.component.html',
  styleUrls: ['./dbrt07-detail.component.scss']
})
export class Dbrt07DetailComponent implements OnInit, CanComponentDeactivate, BasicForm {
  dbRaceForm: FormGroup;
  dbRace: DbRace = {} as DbRace;
  permission = {} as Permission;
  saving = false;

  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    public util: FormUtilService,
    private ms: MessageService,
    private modal: ModalService,
    private db: Dbrt07Service
  ) { }

  ngOnInit() {
    this.createForm();
    this.route.data.subscribe((data) => {
      this.permission = data.dbrt07.permission;
      this.dbRace = data.dbrt07.detail;
      this.rebuildForm();
    });
    this.installEvent();
  }
  createForm() {
    this.dbRaceForm = this.fb.group({
      raceCode: [null , [Validators.required, Validators.maxLength(5)]],
      raceNameTha: [null , [Validators.required, Validators.maxLength(50)]],
      raceNameEng: [null , [Validators.required, Validators.maxLength(50)]],
      active: CommonConstants.Status.Active,
      activeBool: true,
      rowVersion: null
    });
  }

  rebuildForm() {
    if (this.dbRace.raceCode ) {
      this.dbRace.activeBool = this.dbRace.active === CommonConstants.Status.Active;
      this.dbRaceForm.patchValue(this.dbRace);
      this.dbRaceForm.controls.raceCode.disable({emitEvent: false});
    }
    if (this.permission.isReadOnly) {
      this.dbRaceForm.disable({emitEvent: false});
    }
    this.dbRaceForm.markAsPristine();
  }

  installEvent() {
    this.dbRaceForm.controls.activeBool.valueChanges.subscribe((activeBool) => {
      if (this.dbRaceForm.controls.activeBool.dirty) {
        this.dbRaceForm.controls.active.setValue(activeBool ? CommonConstants.Status.Active : CommonConstants.Status.Inactive);
      }
    });
  }

  save() {
    if (this.isFormValid()) {
      this.saving = true;
      this.db.save(this.dbRace , this.dbRaceForm.getRawValue()).pipe(
        switchMap(result => this.db.findDbRaceByKey(result.raceCode)),
        finalize(() => this.saving = false)
      ).subscribe((result) => {
        this.dbRace = result;
        this.rebuildForm();
        this.ms.success('message.STD00006');
      });
    }
  }

  isFormValid(): boolean {
    return this.util.isFormGroupValid(this.dbRaceForm);
  }

  isFormDirty(): boolean {
    return this.dbRaceForm.dirty;
  }

  canDeactivate(): Observable<boolean> {
    if (!this.isFormDirty()) {
      return of(true);
    }
    return this.modal.confirm('message.STD00002'); // ละทิ้งการเปลี่ยนแปลงหรือไม่
  }

}
