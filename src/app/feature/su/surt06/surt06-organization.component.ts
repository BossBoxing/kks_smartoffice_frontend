import { Component, OnInit, ViewChild } from '@angular/core';
import { Location } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FormUtilService, ModalService, RowState, SubscriptionDisposer } from '@app/shared';
import { CanComponentDeactivate, MessageService } from '@app/core';
import { Surt06Service, SuUser, SuUserOrg } from './surt06.service';
import { Observable, of, BehaviorSubject, Subject } from 'rxjs';
import { finalize, map, switchMap } from 'rxjs/operators';
import { BasicForm } from '@app/shared/component/base-form';
import { Permission } from '@app/shared/service/permission.service';
import { DivisionTreeComponent } from './division-tree/division-tree.component';
import { CommonConstants } from '@app/feature/common/common-constants';

@Component({
  selector: 'app-surt06-organization',
  templateUrl: './surt06-organization.component.html'
})
export class Surt06OrganizationComponent extends SubscriptionDisposer implements OnInit, CanComponentDeactivate, BasicForm {
  suUser: SuUser = {} as SuUser;
  suUserOrganization: SuUserOrg = {} as SuUserOrg;
  suUserOrganizationForm: FormGroup;

  divisions = new BehaviorSubject<any>([]);
  @ViewChild(DivisionTreeComponent) divisionTree: DivisionTreeComponent;
  companyReady = new Subject<boolean>();

  // su_user_org_unit.ou_code
  orgOuCode;
  saving = false;
  permission = {} as Permission;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    public util: FormUtilService,
    private ms: MessageService,
    private modal: ModalService,
    private location: Location,
    public su: Surt06Service
  ) { super(); }

  ngOnInit() {
    this.createForm();
    this.route.data.subscribe((data) => {
      if (data.surt06.detail && data.surt06.detail.userId) {
        this.suUser = data.surt06.detail;
        this.divisions.next(data.surt06.divisions); // all devision tree by su_user_org_unit.ou_code
        this.initialMasterData(data);
        this.rebuildForm();
      } else {
        this.router.navigate(['/su/surt06']);
      }
    });
    this.installEvent();
  }

  initialMasterData(data: any) {
    this.permission = data.surt06.permission;
    this.orgOuCode = this.suUser.orgOuCode;
  }

  installEvent() {
    this.suUserOrganizationForm.controls.ouCode.valueChanges.subscribe(ouCode => {
      this.suUser.orgOuCode = ouCode;
      if (ouCode) {
        this.su.findSuDivisions({ ouCode }).pipe(
          map(dep => dep)
        ).subscribe(row => {
          this.divisions.next(row);
        });
      } else {
        this.divisions.next([]);
        this.companyReady.next(false);
      }
    });
  }

  createForm() {
    this.suUserOrganizationForm = this.fb.group({
      userId: { value: null, disabled: true },
      userName: { value: null, disabled: true },
      empName: { value: null, disabled: true },
      ouCode: [null, Validators.required],
      effDate: [null, Validators.required],
      endDate: null,
      rowVersion: null
    });
  }

  rebuildForm() {
    this.suUserOrganizationForm.markAsPristine();
    this.suUser.activeBool = this.suUser.active === CommonConstants.Status.Active;
    this.suUser.rowState = RowState.Edit;
    this.suUserOrganization = this.orgOuCode
      ? this.suUser.userOrgDto.find(row => row.ouCode === this.orgOuCode)
      : {} as SuUserOrg;
    if (!this.suUserOrganization.userOrgUnitDto) {
      this.suUserOrganization.userOrgUnitDto = [];
    }
    this.suUserOrganization.ouCode = this.orgOuCode;
    this.suUserOrganization.userName = this.suUser.userName;
    if (this.orgOuCode) {
      this.suUserOrganization.rowState = RowState.Edit;
      this.suUserOrganizationForm.patchValue(this.suUserOrganization, { emitEvent: false });
      this.suUserOrganizationForm.controls.ouCode.disable({ emitEvent: false });
    } else {
      this.suUserOrganization.userId = this.suUser.userId;
      this.suUserOrganization.empName = this.suUser.empName;
      this.suUserOrganization.rowState = RowState.Add;
      this.suUserOrganizationForm.patchValue(this.suUserOrganization);
      this.suUserOrganization.userOrgUnitDto = [];
    }

    if (this.isReadOnly()) {
      this.suUserOrganizationForm.disable({ emitEvent: false });
    }
    this.suUserOrganizationForm.markAsPristine();
  }

  onSearchOuCode = (keyword, value) => {
    return this.su.findOuCodeForATC(keyword, value, { active: true });
  }

  divisionChanged() {
    this.suUserOrganizationForm.markAsDirty();
  }

  isReadOnly(): boolean {
    return this.permission.isReadOnly;
  }

  isFormDirty(): boolean {
    return this.suUserOrganizationForm.dirty;
  }

  isFormValid(): boolean {
    let isValidated = true;
    if (this.util.isFormGroupValid(this.suUserOrganizationForm) === false) {
      isValidated = false;
    }
    return isValidated;
  }

  save() {
    this.suUserOrganization.userOrgUnitDto = this.divisionTree.selected.filter(select => select.rowState === RowState.Add);
    this.suUserOrganization.userOrgUnitDto = this.suUserOrganization.userOrgUnitDto.concat(this.divisionTree.removed);
    if (this.isFormValid()) {
      this.saving = true;
      this.su.saveOranization(
        this.suUser
        , this.suUserOrganization
        , this.suUserOrganizationForm.getRawValue()
      ).pipe(
        switchMap(result => this.su.findSuUserOrgByKey(result.ouCode, result.userId)),
        finalize(() => this.saving = false)
      ).subscribe((result) => {
        this.suUser = result;
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
