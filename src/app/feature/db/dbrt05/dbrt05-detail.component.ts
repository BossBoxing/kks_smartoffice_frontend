import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable, of } from 'rxjs';
import { switchMap, finalize } from 'rxjs/operators';
import { FormUtilService, ModalService, RowState } from '@app/shared';
import { CanComponentDeactivate, MessageService } from '@app/core';
import { DbDistrictDTO, DbProvince, Dbrt05Service } from './dbrt05.service';
import { BasicForm } from '@app/shared/component/base-form';
import { Guid } from 'guid-typescript';
import { CustomValidators } from '@app/shared/directive/custom.validator';
import { CommonConstants } from '@app/feature/common/common-constants';
import { Permission } from '@app/shared/service/permission.service';


@Component({
  selector: 'app-dbrt05-detail',
  templateUrl: './dbrt05-detail.component.html',
  styleUrls: ['./dbrt05-detail.component.scss']
})
export class Dbrt05DetailComponent implements OnInit, CanComponentDeactivate, BasicForm {
  dbProvinceForm: FormGroup;
  dbProvince: DbProvince = {} as DbProvince;
  dbDistrictDelete: DbDistrictDTO[] = [] as DbDistrictDTO[];
  permission = {} as Permission;
  saving = false;

  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    public util: FormUtilService,
    private ms: MessageService,
    private modal: ModalService,
    private db: Dbrt05Service
  ) { }

  ngOnInit() {
    this.createForm();
    this.route.data.subscribe((data) => {
      this.permission = data.dbrt05.permission;
      this.dbProvince = data.dbrt05.detail;
      this.rebuildForm();
    });
    this.installEvent();
  }

  createForm() {
    this.dbProvinceForm = this.fb.group({
      countryCode: [null , [Validators.required, Validators.maxLength(10)]],
      provinceCode: [null , [Validators.required, Validators.maxLength(5)]],
      provinceNameTha: [null , [Validators.maxLength(50)]],
      provinceNameEng: [null , [Validators.maxLength(50)]],
      active: CommonConstants.Status.Active,
      activeBool: true,
      rowVersion: null
    });
  }

  rebuildForm() {
    this.dbDistrictDelete = [];
    this.dbProvinceForm.markAsPristine();
    if (this.dbProvince.countryCode && this.dbProvince.provinceCode) {
      this.dbProvince.activeBool = this.dbProvince.active === CommonConstants.Status.Active;
      // set province data to form
      this.dbProvinceForm.patchValue(this.dbProvince);
      // set disticts detail form by province
      this.dbProvince.districts.forEach(value => value.form = this.createDistrictDetailForm(value));
      // disable master pk fields
      this.dbProvinceForm.controls.countryCode.disable({emitEvent: false});
      this.dbProvinceForm.controls.provinceCode.disable({emitEvent: false});
    } else {
      this.dbProvince.districts = []; // reset district when add new set
    }
    if (this.permission.isReadOnly) {
      this.dbProvinceForm.disable({emitEvent: false});
      this.dbProvince.districts.forEach(row => row.form.disable({emitEvent: false}) );
    }
    this.dbProvinceForm.markAsPristine();
  }

  installEvent() {
    this.dbProvinceForm.controls.activeBool.valueChanges.subscribe((activeBool) => {
      if (this.dbProvinceForm.controls.activeBool.dirty) {
        this.dbProvinceForm.controls.active.setValue(activeBool ? CommonConstants.Status.Active : CommonConstants.Status.Inactive);
      }
    });
  }

  createDistrictDetailForm(distictDetail: DbDistrictDTO) {
    const fg = this.fb.group({
      countryCode: null
      , provinceCode: null
      , districtCode: [null , [Validators.required, Validators.maxLength(5), CustomValidators.duplicate(this.dbProvince.districts)]]
      , districtNameTha: [null , [Validators.required, Validators.maxLength(50)]]
      , districtNameEng: [null , [Validators.required, Validators.maxLength(50)]]
      , active: CommonConstants.Status.Active
      , activeBool: true
      , rowVersion: null
      , guid: Guid.raw()
    });
    distictDetail.guid = fg.controls.guid.value;
    distictDetail.activeBool = distictDetail.active === CommonConstants.Status.Active;
    fg.patchValue(distictDetail, { emitEvent: false });

    // disabled district pk
    if (distictDetail.rowState === RowState.Normal) {
      fg.controls.districtCode.disable({emitEvent: false});
    }

    // installEvent for all controls
    fg.valueChanges.subscribe((controls) => {
      if (distictDetail.rowState === RowState.Normal) {
        distictDetail.rowState = RowState.Edit;
      }
    });

    // installEvent for active Y/N
    fg.controls.activeBool.valueChanges.subscribe(activeBool => {
      if (fg.controls.activeBool.dirty) {
        fg.controls.active.setValue(activeBool ? CommonConstants.Status.Active : CommonConstants.Status.Inactive);
      }
    });

    if (distictDetail.rowVersion) {
      fg.markAsPristine();
    }
    return fg;
  }

  addDistrictDetail() {
    const districtDetail: DbDistrictDTO = {
      countryCode: null
      , provinceCode: null
      , districtCode: null
      , districtNameTha: null
      , districtNameEng: null
      , active: CommonConstants.Status.Active
      , activeBool: true
      , rowVersion: null
      , guid: Guid.raw()
      , rowState: RowState.Add
    };
    districtDetail.form = this.createDistrictDetailForm(districtDetail);
    this.dbProvince.districts = this.dbProvince.districts.concat(districtDetail);
    this.dbProvinceForm.markAsDirty();
  }

  removeDistrictDetail(detail: DbDistrictDTO) {
    if (detail.rowState !== RowState.Add) {
      detail.rowState = RowState.Delete;
      this.dbDistrictDelete.push(detail);
    }
    this.dbProvince.districts = this.dbProvince.districts.filter(item => item.guid !== detail.guid);
    this.dbProvinceForm.markAsDirty();
  }

  save() {
    const forms: FormGroup[] = [this.dbProvinceForm].concat(this.dbProvince.districts.map(detail => detail.form));
    if (this.util.isFormGroupsValid(forms) && this.isFormValid()) {
      this.saving = true;
      this.db.save(this.dbProvince , this.dbProvinceForm.getRawValue() , this.dbDistrictDelete).pipe(
        switchMap(result => this.db.findDbProvinceByKey(result.countryCode, result.provinceCode)),
        finalize(() => this.saving = false)
      ).subscribe((result) => {
        this.dbProvince = result;
        this.rebuildForm();
        this.ms.success('message.STD00006');
      });
    }
  }

  isFormValid(): boolean {
    let isValidated = true;
    if (this.dbProvince.districts.length === 0) {
      this.ms.warning('message.STD00012', ['label.DBRT05.DistrictCode']); // ต้องมี {{0}} อย่างน้อย 1 รายการ
      isValidated = false;
    }
    return isValidated;
  }

  onSearchCountry = (keyword, value) => {
    return this.db.findCountryForATC(keyword, value);
  }

  isFormDirty(): boolean {
    return this.dbProvinceForm.dirty
      || this.dbProvince.districts.some(item => item.form.dirty);
  }

  canDeactivate(): Observable<boolean> {
    if (!this.isFormDirty()) {
      return of(true);
    }
    return this.modal.confirm('message.STD00002'); // ละทิ้งการเปลี่ยนแปลงหรือไม่
  }
}
