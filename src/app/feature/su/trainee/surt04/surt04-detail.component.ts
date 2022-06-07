import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CanComponentDeactivate, MessageService } from '@app/core';
import { CommonConstants } from '@app/feature/common/common-constants';
import { FormUtilService, ModalService } from '@app/shared';
import { BasicForm } from '@app/shared/component/base-form';
import { Observable, of } from 'rxjs';
import { finalize, switchMap } from 'rxjs/operators';
import { SuProfile, Surt04Service } from './surt04.service';


@Component({
  selector: 'app-surt04-detail',
  templateUrl: './surt04-detail.component.html',
  styleUrls: ['./surt04-detail.component.scss']
})
export class Surt04DetailComponent implements OnInit, CanComponentDeactivate, BasicForm  {
  suProfile: SuProfile;
  suProfileForm!: FormGroup;
  saving = false;
  param: any = this.router.getCurrentNavigation()?.extras.state;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    public util: FormUtilService,
    private modal: ModalService,
    private fb: FormBuilder,
    private service: Surt04Service,
    private ms: MessageService,
  ) { }

  ngOnInit(): void {
    this.createForm();
    this.route.data.subscribe((data) => {
      this.suProfile = data.surt04.detail;
      this.rebuildForm();
    });
    this.installEvent();
  }

  createForm() {
    this.suProfileForm = this.fb.group({
      profileId: [null , [Validators.required, Validators.maxLength(5)]],
      profileName: [null , [Validators.required, Validators.maxLength(30)]],
      code: [null , [Validators.required, Validators.maxLength(5)]],
      description: [null , [Validators.required, Validators.maxLength(50)]],
      status: CommonConstants.Status.Active,
      activeBool: true,
      rowVersion: null
    });
  }

  // ค่าช่องใช้งาน
  installEvent() {
    this.suProfileForm.controls.activeBool.valueChanges.subscribe((activeBool) => {
      if (this.suProfileForm.controls.activeBool.dirty) {
        this.suProfileForm.controls.status.setValue(activeBool ? CommonConstants.Status.Active : CommonConstants.Status.Inactive);
      }
    });
  }

  save() {
    if (this.isFormValid()) {
      this.saving = true;
      this.service.save(this.suProfile , this.suProfileForm.getRawValue()).pipe(
        switchMap(result => this.service.findsuProfileByKey(result.profileId)),
        finalize(() => this.saving = false)
      ).subscribe((result) => {
        this.suProfile = result;
        this.rebuildForm();
        this.ms.success('message.STD00006');
      });
    }
  }

  // เอาค่ามาใส่ form
  rebuildForm() {
    this.suProfileForm.markAsPristine();
    if (this.suProfile.profileId) {
      this.suProfile.activeBool = this.suProfile.status === CommonConstants.Status.Active;
      this.suProfileForm.patchValue(this.suProfile);
      this.suProfileForm.controls.profileId.disable({emitEvent: false}); // ไม่ให้แก้
    }
    this.suProfileForm.markAsPristine();
  }

  isFormValid(): boolean {
    return this.util.isFormGroupValid(this.suProfileForm); // ฟอร์มถูกต้องไหม
  }

  isFormDirty(): boolean {
    return this.suProfileForm.dirty; // ฟอร์มถูกแก้ไขไหม
  }

  canDeactivate(): Observable<boolean> {
    if (!this.isFormDirty()) {
      return of(true);
    }
    return this.modal.confirm('message.STD00002');
  }

}
