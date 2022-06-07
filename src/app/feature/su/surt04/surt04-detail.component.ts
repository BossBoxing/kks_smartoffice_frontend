import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Surt04Service, SuProfile, SuProfileMenu } from './surt04.service';
import { ActivatedRoute } from '@angular/router';
import { FormUtilService, ModalService, RowState, Size, LookupMultipleResult, SubscriptionDisposer } from '@app/shared';
import { CanComponentDeactivate, MessageService } from '@app/core';
import { switchMap, finalize, takeUntil } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { CommonConstants } from '@app/feature/common/common-constants';
import { Surt04MenuLookupComponent } from './surt04-menu-lookup/surt04-menu-lookup.component';
import { Guid } from 'guid-typescript';

@Component({
  selector: 'app-surt04-detail',
  templateUrl: './surt04-detail.component.html'
})
export class Surt04DetailComponent extends SubscriptionDisposer implements OnInit, CanComponentDeactivate {
  profileForm: FormGroup;
  suProfile: SuProfile = {} as SuProfile;
  profileMenuDtoDelete: SuProfileMenu[] = [] as SuProfileMenu[];
  saving = false;
  menuLookup = Surt04MenuLookupComponent;
  permission = {
    isReadOnly: null
  };

  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    public util: FormUtilService,
    private ms: MessageService,
    private modal: ModalService,
    private su: Surt04Service,
    private cd: ChangeDetectorRef,
  ) {
    super();
  }

  ngOnInit() {
    this.createForm();
    this.route.data.subscribe((data) => {
      this.suProfile = data.surt04.detail;
      this.rebuildForm();
    });
    this.installEvent();
  }

  createForm() {
    this.profileForm = this.fb.group({
      profileId: [{ value: CommonConstants.Auto.Text, disabled: true }],
      code: [null, [Validators.required, Validators.maxLength(50)]],
      profileName: [null, [Validators.required, Validators.maxLength(50)]],
      description: [null, [Validators.maxLength(300)]],
      status: 'Y',
      active: true
    });
  }

  rebuildForm() {
    this.profileMenuDtoDelete = [];
    this.profileForm.markAsPristine();
    if (this.suProfile.rowVersion) {
      this.suProfile.active = this.suProfile.status === CommonConstants.Status.Active;
      this.profileForm.patchValue(this.suProfile);
      this.profileForm.controls.profileId.disable({ emitEvent: false });
      this.suProfile.profileMenuDto.forEach(row => row.form = this.createSuProfileMenuForm(row));
    } else {
      this.suProfile.profileMenuDto = [];
    }
    if (this.isReadOnly()) {
      this.profileForm.disable({ emitEvent: false });
      this.suProfile.profileMenuDto.forEach(row => row.form.disable({ emitEvent: false }));
    }
    this.profileForm.markAsPristine();
  }

  installEvent() {
    this.profileForm.controls.active.valueChanges.subscribe((active) => {
      if (this.profileForm.controls.active.dirty) {
        this.profileForm.controls.status.setValue(active ? CommonConstants.Auto.Yes : CommonConstants.Auto.No);
      }
    });
  }

  /****** Popup select menus ******/
  selectMenus() {
    if (this.util.isFormGroupValid(this.profileForm)) {
      const initial = {
        selectedList: [].concat(this.suProfile.profileMenuDto),
        parameter: {}
      };
      this.modal.openComponent(this.menuLookup, Size.large, initial)
        .pipe(takeUntil(this.ngUnsubscribe))
        .subscribe((list: LookupMultipleResult) => {
          if (list) {
            list.selected.forEach(select => {
              select.rowState = RowState.Add;
              select.form = this.createSuProfileMenuForm(select);
            });
            this.suProfile.profileMenuDto = this.suProfile.profileMenuDto.concat(list.selected as SuProfileMenu[]);
            this.profileForm.markAsDirty();
          }
        });
    }
  }

  createSuProfileMenuForm(profileMenu: SuProfileMenu) {
    const fg = this.fb.group({
      profileId: 0
      , menuId: null
      , menuName: null
      , allFlag: 'Y'
      , isAllFlag: true
      , rowVersion: null
      , guid: Guid.raw()
    });
    profileMenu.guid = fg.controls.guid.value;
    profileMenu.isAllFlag = profileMenu.allFlag ? profileMenu.allFlag === CommonConstants.BooleanFlag.True : false;
    fg.patchValue(profileMenu, { emitEvent: false });

    fg.valueChanges.subscribe((controls) => {
      if (profileMenu.rowState === RowState.Normal) {
        profileMenu.rowState = RowState.Edit;
      }
    });

    fg.controls.isAllFlag.valueChanges.subscribe(isAllFlag => {
      if (fg.controls.isAllFlag.dirty) {
        fg.controls.allFlag.setValue(isAllFlag
          ? CommonConstants.BooleanFlag.True
          : CommonConstants.BooleanFlag.False
          , { emitEvent: false });
      }
    });

    if (profileMenu.rowVersion) {
      fg.markAsPristine();
    }
    return fg;
  }

  removeSuProfileMenu(profileMenu: SuProfileMenu) {
    if (profileMenu.rowState !== RowState.Add) {
      profileMenu.rowState = RowState.Delete;
      this.profileMenuDtoDelete.push(profileMenu);
    }
    this.suProfile.profileMenuDto = this.suProfile.profileMenuDto.filter(item => item.guid !== profileMenu.guid);
    this.profileForm.markAsDirty();
  }

  isReadOnly(): boolean {
    return this.permission.isReadOnly;
  }

  isFormDirty(): boolean {
    return this.profileForm.dirty
      || this.suProfile.profileMenuDto.some(item => item.form.dirty);
  }

  isFormValid(): boolean {
    let isValidated = true;
    if (this.util.isFormGroupValid(this.profileForm) === false) {
      isValidated = false;
    }

    if (this.isFormGroupsValid(this.suProfile.profileMenuDto.map(row => row.form), isValidated) === false) {
      isValidated = false;
    }

    if (this.suProfile.profileMenuDto.length === 0) {
      this.ms.warning('message.STD00012', ['label.SURT04.Menu']);
      // ต้องมี {{0}} อย่างน้อย 1 รายการ
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

  save() {
    if (this.isFormValid()) {
      this.saving = true;
      this.su.save(this.suProfile
        , this.profileForm.getRawValue()
        , this.profileMenuDtoDelete
      ).pipe(
        switchMap(result => this.su.findSuProfileByKey(result.profileId)),
        finalize(() => this.saving = false)
      ).subscribe(result => {
        this.suProfile = result;
        this.rebuildForm();
        this.ms.success('message.STD00006');
      });
    }
  }

  canDeactivate(): Observable<boolean> {
    if (!this.isFormDirty()) {
      return of(true);
    }
    return this.modal.confirm('message.STD00002');
  }

}
