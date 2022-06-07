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
import { SuUser, SuUserProfile, Surt02Service } from './surt02.service';

@Component({
  selector: 'app-surt02-detail',
  templateUrl: './surt02-detail.component.html',
  styleUrls: ['./surt02-detail.component.scss']
})
export class Surt02DetailComponent implements OnInit, CanComponentDeactivate, BasicForm  {
  suUser: SuUser = {} as SuUser ;
  suUserProfileDelete: SuUserProfile[] = [] as SuUserProfile[];
  suUserForm: FormGroup;
  saving = false;
  constructor(
    private route: ActivatedRoute,
    public util: FormUtilService,
    private modal: ModalService,
    private fb: FormBuilder,
    private service: Surt02Service,
    private ms: MessageService,
  ) { }

  ngOnInit(): void {
    this.createForm();
    this.route.data.subscribe((data) => {
      this.suUser = data.surt02.detail;
      this.rebuildForm();
    });

    this.installEvent();
  }

  createForm() {
    this.suUserForm = this.fb.group({
      id: [null , [Validators.required, Validators.maxLength(10)]],
      userName: [null , [Validators.required, Validators.maxLength(20)]],
      profileId: [null , [Validators.required, Validators.maxLength(10)]],
      address: [null , [Validators.required, Validators.maxLength(300)]],
      telephone: [null , [Validators.required, Validators.maxLength(10)]],
      email: [null , [Validators.required, Validators.email, Validators.maxLength(100)]],
      active: CommonConstants.Status.Active,
      activeBool: true,
      rowVersion: null
    });
  }

  installEvent() {
    this.suUserForm.controls.activeBool.valueChanges.subscribe((activeBool) => {
      if (this.suUserForm.controls.activeBool.dirty) {
        this.suUserForm.controls.active.setValue(activeBool ? CommonConstants.Status.Active : CommonConstants.Status.Inactive);
      }
    });
  }

  save() {
    const forms: FormGroup[] = [this.suUserForm].concat(this.suUser.profiles.map(detail => detail.form));
    if (this.util.isFormGroupsValid(forms) && this.isFormValid()) {
      this.saving = true;
      this.service.save(this.suUser , this.suUserForm.getRawValue() , this.suUserProfileDelete).pipe(
        switchMap(result => this.service.findsuUserByKey(this.suUser.id, result.profileId)),
        finalize(() => this.saving = false)
      ).subscribe((result) => {
        this.suUser = result;
        this.rebuildForm();
        this.ms.success('message.STD00006');
      });
    }
  }

  rebuildForm() {
    this.suUserForm.markAsPristine();
    if (this.suUser.rowVersion) {
      this.suUser.activeBool = this.suUser.active === CommonConstants.Status.Active;
      this.suUserForm.patchValue(this.suUser);

      this.suUser.profiles.forEach(value => value.form = this.createProfileDetailForm(value));
      this.suUserForm.controls.id.disable({emitEvent: false});
      this.suUserForm.controls.userName.disable({emitEvent: false});
      this.suUserForm.controls.profileId.disable({emitEvent: false});
      this.suUserForm.controls.address.disable({emitEvent: false});
      this.suUserForm.controls.telephone.disable({emitEvent: false});
      this.suUserForm.controls.email.disable({emitEvent: false});
      this.suUserForm.controls.activeBool.disable({emitEvent: false});
    } else {
      this.suUser.profiles = [];
    }
    this.suUserForm.markAsPristine();
  }

  createProfileDetailForm(suUserProfile: SuUserProfile) {
    const fg = this.fb.group({
      id: this.suUser.id,
      profileId: [null, [Validators.required, Validators.maxLength(200), CustomValidators.duplicate(this.suUser.profiles)]]
      , effDate: [null, [Validators.required]]
      , endDate: null
      , rowVersion: null
      , guid: Guid.raw()
      , rowState: null

    });
    suUserProfile.guid = fg.controls.guid.value;
    fg.patchValue(suUserProfile, { emitEvent: false });

    // disabled UserProfile pk
    if (suUserProfile.rowState === RowState.Normal) {
      fg.controls.profileId.disable({emitEvent: false});
    }

    // installEvent for all controls
    fg.valueChanges.subscribe((controls) => {
      if (suUserProfile.rowState === RowState.Normal) {
        suUserProfile.rowState = RowState.Edit;
      }
    });

    fg.controls.effDate.valueChanges.subscribe(effDate => {
      if (fg.controls.effDate.dirty) {
        fg.controls.rowState.setValue(RowState.Edit);
      }
    });

    fg.controls.endDate.valueChanges.subscribe(endDate => {
      if (fg.controls.endDate.dirty) {
        fg.controls.rowState.setValue(RowState.Edit);
      }
    });

    if (suUserProfile.rowVersion) {
      fg.markAsPristine();
    }
    return fg;
  }

  addProfileDetail() {
    const ProfileDetail: SuUserProfile = {
      id: this.suUser.id
      , profileId: null
      , effDate: new Date()
      , endDate: null
      , rowVersion: null
      , guid: Guid.raw()
      , rowState: RowState.Add
    };
    ProfileDetail.form = this.createProfileDetailForm(ProfileDetail);
    this.suUser.profiles = this.suUser.profiles.concat(ProfileDetail);
    this.suUserForm.markAsDirty();
  }

  removeProfileDetail(detail: SuUserProfile) {
    if (detail.rowState !== RowState.Add) {
      detail.rowState = RowState.Delete;
      this.suUserProfileDelete.push(detail);
    }
    this.suUser.profiles = this.suUser.profiles.filter(item => item.guid !== detail.guid);
    this.suUserForm.markAsDirty();
  }

  onSearchProfileId = (keyword, value) => {
    return this.service.findProfileNameForAtc(keyword, value);
  }

  isFormValid(): boolean {
    return this.util.isFormGroupValid(this.suUserForm);
  }

  isFormDirty(): boolean {
    return this.suUserForm.dirty || this.suUser.profiles.some(item => item.form.dirty);
  }

  canDeactivate(): Observable<boolean> {
    if (!this.isFormDirty()) {
      return of(true);
    }
    return this.modal.confirm('message.STD00002');
  }

}
