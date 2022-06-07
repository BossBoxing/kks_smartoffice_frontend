import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { CanComponentDeactivate, MessageService } from '@app/core';
import { CommonConstants } from '@app/feature/common/common-constants';
import { FormUtilService, ModalService, RowState } from '@app/shared';
import { BasicForm } from '@app/shared/component/base-form';
import { CustomValidators } from '@app/shared/directive/custom.validator';
import { Guid } from 'guid-typescript';
import { Observable, of } from 'rxjs';
import { finalize, switchMap } from 'rxjs/operators';
import { DbProvince, DbDistrict, Tndbrt05Service } from '../tndbrt05.service';

@Component({
  selector: 'app-tndbrt05-detail',
  templateUrl: './tndbrt05-detail.component.html',
  styleUrls: ['./tndbrt05-detail.component.scss']
})

export class Tndbrt05DetailComponent implements OnInit, CanComponentDeactivate, BasicForm {
  dbProvinceForm: FormGroup;
  dbProvince: DbProvince = {} as DbProvince;
  dbDistrictDelete: DbDistrict[] = [] as DbDistrict[];
  saving = false;

  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    public util: FormUtilService,
    private ms: MessageService,
    private modal: ModalService,
    private db: Tndbrt05Service
  ) { }

  ngOnInit() {
    this.createForm();
    this.route.data.subscribe((data) => {
      this.dbProvince = data.tndbrt05.detail;
      this.rebuildForm();
      console.log(this.dbProvince);
    });
    this.installEvent();
  }
  createForm() {
    this.dbProvinceForm = this.fb.group({
      provinceCode: [null, [Validators.required, Validators.maxLength(10)]],
      countryCode: [null, [Validators.required, Validators.maxLength(100)]],
      provinceNameTha: [null , [Validators.maxLength(50)]],
      provinceNameEng: [null , [Validators.maxLength(50)]],
      active: CommonConstants.Status.Active,
      activeBool: true,
      rowVersion: null
    });
  }

  rebuildForm() {
    this.dbProvinceForm.markAsPristine();
    if (this.dbProvince.rowVersion) {
      this.dbProvince.activeBool = this.dbProvince.active === CommonConstants.Status.Active;
      this.dbProvinceForm.patchValue(this.dbProvince);
      this.dbProvince.districts.forEach(value => value.form = this.createDistrictDetailForm(value));
      this.dbProvinceForm.controls.provinceCode.disable({ emitEvent: false });
      this.dbProvinceForm.controls.countryCode.disable({ emitEvent: false });
    } else {
      this.dbProvince.districts = [];
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

  createDistrictDetailForm(distictDetail: DbDistrict) {
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
    console.log(this.dbDistrictDelete);
  }

  addDistrictDetail() {
    const districtDetail: DbDistrict = {
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

  removeDistrictDetail(detail: DbDistrict) {
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
        switchMap(result => this.db.findDbProvinceByKey(result.provinceCode, result.countryCode)),
        finalize(() => this.saving = false)
      ).subscribe((result) => {
        this.dbProvince = result;
        this.rebuildForm();
        this.ms.success('message.STD00006');
      });
    }
  }

  isFormValid(): boolean {
    return this.util.isFormGroupValid(this.dbProvinceForm);
  }

  isFormDirty(): boolean {
    return this.dbProvinceForm.dirty || this.dbProvince.districts.some(item => item.form.dirty);
  }

  canDeactivate(): Observable<boolean> {
    if (!this.isFormDirty()) {
      return of(true);
    }
    return this.modal.confirm('message.STD00002');
  }

  onSearchCountry = (keyword, value) => {
    return this.db.findCountryCodeForATC(keyword, value);
  }

}


