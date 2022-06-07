import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, of, Subject } from 'rxjs';
import { switchMap, finalize, takeUntil } from 'rxjs/operators';
import { FormUtilService, ModalService, RowState, SubscriptionDisposer } from '@app/shared';
import { CanComponentDeactivate, MessageService } from '@app/core';
import { PasswordDto, Surt06Service, SuUser, SuUserOrg, SuUserProfile } from './surt06.service';
import { BasicForm } from '@app/shared/component/base-form';
import { Guid } from 'guid-typescript';
import { CustomValidators } from '@app/shared/directive/custom.validator';
import { CommonConstants } from '@app/feature/common/common-constants';
import { Permission } from '@app/shared/service/permission.service';
import { TabsetComponent } from 'ngx-bootstrap';

@Component({
  selector: 'app-surt06-detail',
  templateUrl: './surt06-detail.component.html',
  styleUrls: ['./surt06-detail.component.scss']
})
export class Surt06DetailComponent extends SubscriptionDisposer implements OnInit, CanComponentDeactivate, BasicForm {
  @ViewChild('detailTabset', { static: false }) detailTabset: TabsetComponent;
  suUserForm: FormGroup;
  passwordForm: FormGroup;
  passwordDto: PasswordDto = {} as PasswordDto;
  suUser: SuUser = {} as SuUser;
  userProfilesDelete: SuUserProfile[] = [] as SuUserProfile[];
  userOrgsDelete: SuUserOrg[] = [] as SuUserOrg[];
  masterData = {
    languages: [],
    profiles: [],
    accountStatus: [],
    passwordAge: 0,
    maxFailTime: 0
  };
  empIdChange = new Subject<any>();
  permission = {} as Permission;
  saving = false;

  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    public util: FormUtilService,
    private ms: MessageService,
    private modal: ModalService,
    private su: Surt06Service,
    private cd: ChangeDetectorRef,
    private router: Router
  ) { super(); }

  ngOnInit() {
    this.createForm();
    this.route.data.subscribe((data) => {
      this.suUser = data.surt06.detail;
      this.initialMasterData(data);
      this.rebuildForm();
    });
    this.installEvent();
  }

  initialMasterData(data: any) {
    this.permission = data.surt06.permission;
    this.masterData = data.surt06.masterData;
    this.masterData.languages = this.util.getActive(this.masterData.languages, this.suUser.userLin);
    this.masterData.profiles = this.util.getActive(this.masterData.profiles, null);
  }

  createForm() {
    this.suUserForm = this.fb.group({
      userId: 0,
      userName: [null, [Validators.required, Validators.maxLength(20), CustomValidators.userName()]],
      ouName: { value: null, disabled: true },
      divName: { value: null, disabled: true },
      empId: [null, [Validators.required]],
      userLin: [null, [Validators.required]],
      email: [null, [Validators.required, Validators.email, Validators.maxLength(100)]],
      telephone: [null, [CustomValidators.phoneNo(), Validators.maxLength(20)]],
      description: [null, [Validators.maxLength(300)]],
      lastChangePwdDate: { value: null, disabled: true },
      nextExpiredPwdDate: { value: null, disabled: true },
      updatedBy: { value: null, disabled: true },
      updatedDate: { value: null, disabled: true },
      lockFlag: [CommonConstants.Status.Inactive, [Validators.required]],
      unlimitFlag: CommonConstants.Status.Inactive,
      unlimitBool: false,
      failTime: { value: 0, disabled: true },
      accountExpireDate: null,
      active: CommonConstants.Status.Active,
      status: CommonConstants.StatusNumber.Active,
      activeBool: true,
      forceFlag: CommonConstants.Status.Inactive,
      forceBool: false,
      rowVersion: null
    });

    this.passwordForm = this.fb.group({
      isChangePassword: false,
      isResetPassword: false,
      oldPassword: { value: 0, disabled: true },
      newPassword: { value: 0, disabled: true },
      confirmPassword: { value: 0, disabled: true },
      rowVersion: null
    });
  }

  rebuildForm() {
    this.userProfilesDelete = [];
    this.suUserForm.markAsPristine();
    this.passwordForm.markAsPristine();
    if (this.suUser.rowVersion) {
      this.suUser.activeBool = this.suUser.active === CommonConstants.Status.Active;
      this.suUser.unlimitBool = this.suUser.unlimitFlag === CommonConstants.Status.Active;
      this.suUser.forceBool = this.suUser.forceFlag === CommonConstants.Status.Active;
      this.suUserForm.patchValue(this.suUser);
      // disable master pk fields
      this.suUserForm.controls.userName.disable({ emitEvent: false });
      this.suUser.userProfiles.forEach(row => row.form = this.createUserProfileForm(row));
      this.suUser.userOrgDto.forEach(row => row.form = this.createUserOrgForm(row));

      // passwordDto
      this.passwordDto.rowVersion = this.suUser.rowVersion;
      this.passwordDto.userId = this.suUser.userId;
      this.passwordDto.rowState = RowState.Edit;
      this.passwordForm.patchValue(this.passwordDto);
    } else {
      this.suUser.userOrgDto = [];
      this.suUser.userProfiles = [];
      this.addUserProfile();
    }
    if (this.permission.isReadOnly) {
      this.suUserForm.disable({ emitEvent: false });
      this.passwordForm.disable({ emitEvent: false });
      this.suUser.userProfiles.forEach(row => row.form.disable({ emitEvent: false }));
      this.suUser.userOrgDto.forEach(row => row.form.disable({ emitEvent: false }));
    }
    this.suUserForm.markAsPristine();
    this.passwordForm.markAsPristine();
  }

  installEvent() {
    this.suUserForm.controls.empId.valueChanges.pipe(
      switchMap(() => this.empIdChange),
      takeUntil(this.ngUnsubscribe)
    ).subscribe(selectedRow => {
      if (selectedRow && selectedRow.value) {
        this.suUserForm.controls.ouName.setValue(selectedRow.ouName);
        this.suUserForm.controls.divName.setValue(selectedRow.divName);
      } else {
        this.suUserForm.controls.ouName.setValue(null);
        this.suUserForm.controls.divName.setValue(null);
      }
    });

    this.suUserForm.controls.activeBool.valueChanges.subscribe((activeBool) => {
      if (this.suUserForm.controls.activeBool.dirty) {
        this.suUserForm.controls.active.setValue(activeBool ? CommonConstants.Status.Active : CommonConstants.Status.Inactive);
        this.suUserForm.controls.status.setValue(activeBool ?
          CommonConstants.StatusNumber.Active : CommonConstants.StatusNumber.Inactive);
      }
    });

    this.suUserForm.controls.unlimitBool.valueChanges.subscribe((unlimitBool) => {
      if (this.suUserForm.controls.unlimitBool.dirty) {
        this.suUserForm.controls.unlimitFlag.setValue(unlimitBool ? CommonConstants.Status.Active : CommonConstants.Status.Inactive);
      }
    });

    this.suUserForm.controls.forceBool.valueChanges.subscribe((forceBool) => {
      if (this.suUserForm.controls.forceBool.dirty) {
        this.suUserForm.controls.forceFlag.setValue(forceBool ? CommonConstants.Status.Active : CommonConstants.Status.Inactive);
      }
    });

    this.suUserForm.controls.lockFlag.valueChanges.subscribe((lockFlag) => {
      if (this.suUserForm.controls.lockFlag.dirty) {
        this.suUserForm.controls.failTime.setValue(0);
      }
    });

    this.passwordForm.controls.isChangePassword.valueChanges.subscribe((isChangePassword) => {
      this.passwordForm.controls.oldPassword.setValue(null, { emitEvent: false });
      this.passwordForm.controls.newPassword.setValue(null, { emitEvent: false });
      this.passwordForm.controls.confirmPassword.setValue(null, { emitEvent: false });
      this.passwordForm.clearValidators();
      this.passwordForm.updateValueAndValidity();
      if (isChangePassword) {
        this.passwordForm.controls.oldPassword.enable({ emitEvent: false });
        this.passwordForm.controls.newPassword.enable({ emitEvent: false });
        this.passwordForm.controls.confirmPassword.enable({ emitEvent: false });

        this.passwordForm.controls.oldPassword.setValidators([Validators.required]);
        this.passwordForm.controls.newPassword.setValidators([Validators.required]);
        this.passwordForm.controls.confirmPassword.setValidators([Validators.required]);
      } else {
        this.passwordForm.controls.oldPassword.disable({ emitEvent: false });
        this.passwordForm.controls.newPassword.disable({ emitEvent: false });
        this.passwordForm.controls.confirmPassword.disable({ emitEvent: false });

        this.passwordForm.controls.oldPassword.clearValidators();
        this.passwordForm.controls.newPassword.clearValidators();
        this.passwordForm.controls.confirmPassword.clearValidators();
      }

      this.passwordForm.controls.oldPassword.updateValueAndValidity();
      this.passwordForm.controls.newPassword.updateValueAndValidity();
      this.passwordForm.controls.confirmPassword.updateValueAndValidity();
    });
  }

  /*** 1. Profile Tab ***/
  createUserProfileForm(userProfile: SuUserProfile) {
    const fg = this.fb.group({
      userId: 0
      , profileId: [null, [Validators.required, CustomValidators.duplicate(this.suUser.userProfiles)]]
      , effDate: [null, [Validators.required]]
      , endDate: null
      , rowVersion: null
      , guid: Guid.raw()
    });
    userProfile.guid = fg.controls.guid.value;
    fg.patchValue(userProfile, { emitEvent: false });

    // disabled pk
    if (userProfile.rowState === RowState.Normal) {
      fg.controls.profileId.disable({ emitEvent: false });
    }

    // installEvent for all controls
    fg.valueChanges.subscribe((controls) => {
      if (userProfile.rowState === RowState.Normal) {
        userProfile.rowState = RowState.Edit;
      }
    });

    if (userProfile.rowVersion) {
      fg.markAsPristine();
    }
    return fg;
  }

  addUserProfile() {
    const userProfile: SuUserProfile = {
      userId: 0
      , profileId: null
      , effDate: null
      , endDate: null
      , rowVersion: null
      , guid: Guid.raw()
      , rowState: RowState.Add
    };
    userProfile.form = this.createUserProfileForm(userProfile);
    this.suUser.userProfiles = this.suUser.userProfiles.concat(userProfile);
    this.suUserForm.markAsDirty();
  }

  removeUserProfile(detail: SuUserProfile) {
    if (detail.rowState !== RowState.Add) {
      detail.rowState = RowState.Delete;
      this.userProfilesDelete.push(detail);
    }
    this.suUser.userProfiles = this.suUser.userProfiles.filter(item => item.guid !== detail.guid);
    this.suUserForm.markAsDirty();
  }

  /*** 2. User Organization Tab ***/
  createUserOrgForm(userOrg: SuUserOrg) {
    const fg = this.fb.group({
      userId: 0
      , ouCode: [null, [Validators.required]]
      , ouName: null
      , effDate: [null, [Validators.required]]
      , endDate: null
      , rowVersion: null
      , guid: Guid.raw()
    });
    userOrg.guid = fg.controls.guid.value;
    fg.patchValue(userOrg, { emitEvent: false });

    // installEvent for all controls
    fg.valueChanges.subscribe((controls) => {
      if (userOrg.rowState === RowState.Normal) {
        userOrg.rowState = RowState.Edit;
      }
    });

    if (userOrg.rowVersion) {
      fg.markAsPristine();
    }
    return fg;
  }

  addUserOrg() {
    if (!this.isFormDirty()) {
      this.router.navigate(['su/surt06/organization'], { state: { userId: this.suUser.userId } });
    } else {
      this.ms.warning('message.STD00035');
    }
  }

  removeUserOrg(userOrg: SuUserOrg) {
    if (userOrg.rowState !== RowState.Add) {
      userOrg.rowState = RowState.Delete;
      this.userOrgsDelete.push(userOrg);
    }
    this.suUser.userOrgDto = this.suUser.userOrgDto.filter(item => item.guid !== userOrg.guid);
    this.suUserForm.markAsDirty();
  }

  /*** 3. Password Tab ***/
  resetPassword() {
    if (this.isFormDirty()) {
      this.ms.warning('message.STD00035');
      return;
    }

    if (this.util.isFormGroupValid(this.passwordForm)) {
      this.modal.confirm('message.SU00049').subscribe(res => {
        if (res) {
          this.passwordForm.controls.isResetPassword.setValue(true, { emitEvent: false });
          this.saving = true;
          this.su.resetPassword(this.passwordDto, this.passwordForm.getRawValue()).pipe(
            switchMap(result => this.su.findSuUserByKey(result.userId)),
            finalize(() => this.saving = false)
          ).subscribe((result) => {
            this.suUser = result;
            this.passwordForm.reset();
            this.passwordForm.controls.isChangePassword.setValue(false, { emitEvent: false });
            this.rebuildForm();
            this.ms.success('message.SU00051');
          });
        }
      });
    }
  }

  changePassword() {
    if (this.isFormDirty()) {
      this.ms.warning('STD00035');
      return;
    }

    this.passwordForm.setValidators([CustomValidators.matched('newPassword', 'confirmPassword')]);
    this.passwordForm.updateValueAndValidity();

    if (this.util.isFormGroupValid(this.passwordForm)) {
      this.modal.confirm('message.SU00050').subscribe(res => {
        if (res) {
          this.passwordForm.controls.isResetPassword.setValue(false, { emitEvent: false });
          this.saving = true;
          this.su.changePassword(this.passwordDto, this.passwordForm.getRawValue()).pipe(
            switchMap(result => this.su.findSuUserByKey(result.userId)),
            finalize(() => this.saving = false)
          ).subscribe((result) => {
            this.suUser = result;
            this.passwordForm.reset();
            this.passwordForm.controls.isChangePassword.setValue(false, { emitEvent: false });
            this.rebuildForm();
            this.ms.success('message.SU00052');
          });
        }
      });
    }
  }

  onSearchEmpId = (keyword, value) => {
    const params = { active: true };
    return this.su.findEmpIdForATC(keyword, value, params);
  }

  save() {
    if (this.isFormValid()) {
      this.saving = true;
      this.su.save(
        this.suUser
        , this.suUserForm.getRawValue()
        , this.userProfilesDelete
        , this.userOrgsDelete).pipe(
          switchMap(result => this.su.findSuUserByKey(result.userId)),
          finalize(() => this.saving = false)
        ).subscribe((result) => {
          this.suUser = result;
          this.rebuildForm();
          this.ms.success('message.STD00006');
        });
    }
  }

  isFormValid(): boolean {
    let isValidated = true;
    if (this.util.isFormGroupValid(this.suUserForm) === false) {
      isValidated = false;
    }

    if (this.isFormGroupsValid(this.suUser.userProfiles.map(row => row.form), isValidated) === false) {
      isValidated = false;
    }

    if (this.suUser.userProfiles.length === 0) {
      this.ms.warning('message.STD00012', ['label.SURT06.Profile']); // ต้องมี {{0}} อย่างน้อย 1 รายการ
      isValidated = false;
    }
    return isValidated;
  }

  isFormGroupsValid(formGroups: FormGroup[], showWarning: boolean = true) {
    let isInvalid = false;
    if (formGroups && formGroups.length > 0) {
      formGroups.forEach(formGroup => {
        this.util.markFormGroupTouched(formGroup);
        this.cd.detectChanges();
        isInvalid = isInvalid || formGroup.invalid;
      });
    }
    if (isInvalid) {
      if (showWarning) {
        this.ms.warning('message.STD00045');
      }
      return false;
    } else {
      return true;
    }
  }

  isFormDirty(): boolean {
    return this.suUserForm.dirty || this.suUser.userProfiles.some(item => item.form.dirty);
  }

  canDeactivate(): Observable<boolean> {
    if (!this.isFormDirty()) {
      return of(true);
    }
    return this.modal.confirm('message.STD00002'); // ละทิ้งการเปลี่ยนแปลงหรือไม่
  }
}
