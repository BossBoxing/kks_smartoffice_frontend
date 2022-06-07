import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { switchMap, finalize } from 'rxjs/operators';
import { FormUtilService, ModalService } from '@app/shared';
import { CanComponentDeactivate, MessageService } from '@app/core';
import { GbEmployee, Dbrt11Service } from './dbrt11.service';
import { BasicForm } from '@app/shared/component/base-form';
import { Observable, of } from 'rxjs';
import { CustomValidators } from '@app/shared/directive/custom.validator';
import { Permission } from '@app/shared/service/permission.service';
import { Category } from '@app/shared/component/attachment/category';

@Component({
  selector: 'app-dbrt11-detail',
  templateUrl: './dbrt11-detail.component.html'
})
export class Dbrt11DetailComponent implements OnInit, CanComponentDeactivate, BasicForm {
  gbEmployeeForm: FormGroup;
  gbEmployee: GbEmployee = {} as GbEmployee;
  permission = {} as Permission;
  filePath: Category = Category.GbEmployeeImage;
  saving = false;
  masterData = {
    empTypes: []
    , empStatus: []
    , genders: []
    , locations: []
  };

  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    public util: FormUtilService,
    private ms: MessageService,
    private modal: ModalService,
    private db: Dbrt11Service
  ) { }

  ngOnInit() {
    this.createForm();
    this.route.data.subscribe((data) => {
      this.gbEmployee = data.dbrt11.detail;
      this.initalMasterData(data);
      this.rebuildForm();
    });
    this.installEvent();
  }

  initalMasterData(data) {
    this.permission = data.dbrt11.permission;
    this.masterData = data.dbrt11.masterData;
  }

  createForm() {
    this.gbEmployeeForm = this.fb.group({
      empId: [null, [Validators.required, Validators.maxLength(10)]]
      , personalId: [null, [CustomValidators.idCard(), Validators.required]]
      , preNameId: [null, [Validators.required, Validators.maxLength(3)]]
      , gender: null
      , pictureId: null
      , tFirstName: [null, [Validators.required, Validators.maxLength(40)]]
      , eFirstName: [null, [Validators.required, Validators.maxLength(40)]]
      , tLastName: [null, [Validators.required, Validators.maxLength(40)]]
      , eLastName: [null, [Validators.required, Validators.maxLength(40)]]
      , tNickname: [null, [Validators.required, Validators.maxLength(30)]]
      , eNickname: [null, [Validators.required, Validators.maxLength(30)]]
      , tNameConcat: null
      , eNameConcat: null
      , raceId: null
      , nationId: null
      , religionId: null
      , districtId: null
      , provinceId: null
      , zipcode: [null, [CustomValidators.fixLength(5)]]
      , workDate: [null, [Validators.required]]
      , positionCode: [null, [Validators.required]]
      // , divCode: [null, [Validators.required]]
      , divisionId: [null, [Validators.required]]
      , managerId: null
      , workDesc: [null, [Validators.maxLength(300)]]
      , empType: [null, [Validators.required]]
      , empStatus: [null, [Validators.required]]
      , trunoverDate: null
      , addr1: [null, [Validators.maxLength(300)]]
      , tel1: [null, [Validators.maxLength(100), CustomValidators.phoneNo()]]
      , email: [null, [Validators.maxLength(200), Validators.email]]
      , locationId: [null, [Validators.required]]
      , birthday: null
      , age: [null, [Validators.max(100)]]
      , high: [null, [Validators.max(300)]]
      , weight: [null, [Validators.max(300)]]
      , bloodType: [null, [Validators.maxLength(3)]]
      , rowVersion: null
    });
  }

  rebuildForm() {
    this.gbEmployeeForm.markAsPristine();
    if (this.gbEmployee.rowVersion) {
      this.gbEmployeeForm.patchValue(this.gbEmployee);
      this.gbEmployeeForm.controls.empId.disable({ emitEvent: false });
    }
    if (this.permission.isReadOnly) {
      this.gbEmployeeForm.disable({ emitEvent: false });
    }
    this.gbEmployeeForm.markAsPristine();
  }

  installEvent() {
    this.gbEmployeeForm.controls.tFirstName.valueChanges.subscribe((tFirstName) => {
      if (this.gbEmployeeForm.controls.tFirstName.dirty) {
        if (tFirstName && this.gbEmployeeForm.controls.tLastName.value) {
          this.gbEmployeeForm.controls.tNameConcat.setValue(tFirstName + ' ' + this.gbEmployeeForm.controls.tLastName.value);
        } else {
          this.gbEmployeeForm.controls.tNameConcat.setValue(null, { emitEvent: false });
        }
      }
    });

    this.gbEmployeeForm.controls.tLastName.valueChanges.subscribe((tLastName) => {
      if (this.gbEmployeeForm.controls.tLastName.dirty) {
        if (this.gbEmployeeForm.controls.tFirstName.value && tLastName) {
          this.gbEmployeeForm.controls.tNameConcat.setValue(this.gbEmployeeForm.controls.tFirstName.value + ' ' + tLastName);
        } else {
          this.gbEmployeeForm.controls.tNameConcat.setValue(null, { emitEvent: false });
        }
      }
    });

    this.gbEmployeeForm.controls.eFirstName.valueChanges.subscribe((eFirstName) => {
      if (this.gbEmployeeForm.controls.eFirstName.dirty) {
        if (eFirstName && this.gbEmployeeForm.controls.eLastName.value) {
          this.gbEmployeeForm.controls.eNameConcat.setValue(eFirstName + ' ' + this.gbEmployeeForm.controls.eLastName.value);
        } else {
          this.gbEmployeeForm.controls.eNameConcat.setValue(null, { emitEvent: false });
        }
      }
    });

    this.gbEmployeeForm.controls.eLastName.valueChanges.subscribe((eLastName) => {
      if (this.gbEmployeeForm.controls.eLastName.dirty) {
        if (this.gbEmployeeForm.controls.eFirstName.value && eLastName) {
          this.gbEmployeeForm.controls.eNameConcat.setValue(this.gbEmployeeForm.controls.eFirstName.value + ' ' + eLastName);
        } else {
          this.gbEmployeeForm.controls.eNameConcat.setValue(null, { emitEvent: false });
        }
      }
    });

    this.gbEmployeeForm.controls.provinceId.valueChanges.subscribe(() => {
      if (this.gbEmployeeForm.controls.provinceId.dirty) {
        this.gbEmployeeForm.controls.districtId.setValue(null, { emitEvent: false });
      }
    });

    this.gbEmployeeForm.controls.empStatus.valueChanges.subscribe(() => {
      if (this.gbEmployeeForm.controls.empStatus.dirty) {
        this.gbEmployeeForm.controls.trunoverDate.setValue(null, { emitEvent: false });
      }
    });
  }

  isFormDirty(): boolean {
    return this.gbEmployeeForm.dirty;
  }

  isFormValid(): boolean {
    return this.util.isFormGroupValid(this.gbEmployeeForm);
  }

  save() {
    if (this.isFormValid()) {
      this.saving = true;
      this.db.save(this.gbEmployee, this.gbEmployeeForm.getRawValue()).pipe(
        switchMap(result => this.db.findGbEmployeeByKey(result.ouCode, result.empId)),
        finalize(() => this.saving = false)
      ).subscribe((result) => {
        this.gbEmployee = result;
        this.rebuildForm();
        this.ms.success('message.STD00006');
      });
    }
  }

  onSearchPreName = (keyword, value) => {
    return this.db.findPreName(keyword, value);
  }

  onSearchProvinceId = (keyword, value) => {
    return this.db.findProvinceCode(keyword, value);
  }

  onSearchDistrict = (keyword, value) => {
    return this.db.findDistrict(keyword, value, this.gbEmployeeForm.controls.provinceId.value);
  }

  onSearchPosition = (keyword, value) => {
    return this.db.findPositionCode(keyword, value);
  }

  onSearchDepartment = (keyword, value) => {
    return this.db.findDepartment(keyword, value);
  }

  onSearchDivision = (keyword, value) => {
    return this.db.findDivision(keyword, value);
  }

  onSearchRaceId = (keyword, value) => {
    return this.db.findRaceId(keyword, value);
  }

  onSearchNation = (keyword, value) => {
    return this.db.findNation(keyword, value);
  }

  onSearchReligion = (keyword, value) => {
    return this.db.findReligion(keyword, value);
  }

  onSearchManager = (keyword, value) => {
    return this.db.findManager(keyword, value, { empId: this.gbEmployeeForm.controls.empId.value });
  }

  canDeactivate(): Observable<boolean> {
    if (!this.isFormDirty()) {
      return of(true);
    }
    return this.modal.confirm('message.STD00002');
  }
}
