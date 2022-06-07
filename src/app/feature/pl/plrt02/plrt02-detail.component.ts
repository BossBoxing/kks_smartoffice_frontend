import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService, CanComponentDeactivate } from '@app/core';
import { CommonConstants } from '@app/feature/common/common-constants';
import { FormUtilService, ModalService, RowState } from '@app/shared';
import { Observable, of } from 'rxjs';
import { finalize, switchMap } from 'rxjs/operators';
import { PlProject, PlRelease, Plrt02Service } from './plrt02.service';
import { Guid } from 'guid-typescript';
import { BasicForm } from '@app/shared/component/base-form';
import { Permission } from '@app/shared/service/permission.service';

@Component({
  selector: 'app-plrt02-detail',
  templateUrl: './plrt02-detail.component.html',
  styleUrls: ['./plrt02-detail.component.scss']
})
export class Plrt02DetailComponent implements OnInit, CanComponentDeactivate, BasicForm {
  plReleaseForm: FormGroup;
  permission = {} as Permission;
  plRelease: PlRelease = {} as PlRelease;
  plProjectDelete: PlProject[] = [] as PlProject[];
  saving = false;
  plCustomerForm: FormGroup;
  param: any = this.router.getCurrentNavigation()?.extras.state;

  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    public util: FormUtilService,
    private ms: MessageService,
    private modal: ModalService,
    private pl: Plrt02Service,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.createForm();
    this.route.data.subscribe((data) => {
      this.permission = data.plrt02.permission;
      this.plRelease = data.plrt02.detail;
      this.rebuildForm();
    });
    this.installEvent();
  }

  createForm() {
    this.plReleaseForm = this.fb.group({
      custCode: [null, [Validators.required]],
      releaseCode: [null, [Validators.required, Validators.maxLength(5)]],
      releaseName: [null, [Validators.required, Validators.maxLength(60)]],
      startDate: [null],
      finishDate: [null],
      workLoad: [null],
      price: [null],
      currencyCode: [null, [Validators.maxLength(4)]],
      remark: [null, [Validators.maxLength(200)]],
      releaseShortName: [null, [Validators.required, Validators.maxLength(10)]],
      active: CommonConstants.Status.Active,
      activeBool: [true],
      rowVersion: [null]
    });
    this.plCustomerForm = this.fb.group({
      custCode: null,
      custName: null,
      shortName: null,
      telNo: null,
      effectiveDate: null,
      toolDev: null,
      active: CommonConstants.Status.Active,
      activeBool: true,
      rowVersion: null
    });
  }

  rebuildForm() {
    this.plProjectDelete = [];
    this.plReleaseForm.markAsPristine();
    this.plCustomerForm.markAsPristine();
    if (this.plRelease.rowVersion) {
      this.plRelease.activeBool = this.plRelease.active === CommonConstants.Status.Active;
      // set data to plReleaseForm
      this.plReleaseForm.patchValue(this.plRelease);
      this.plReleaseForm.controls.custCode.disable();
      this.plReleaseForm.controls.releaseCode.disable();
      this.plReleaseForm.controls.releaseName.disable();

      this.plCustomerForm.patchValue(this.plRelease.plCustomer);
      this.plCustomerForm.disable({ emitEvent: false });
      // set detail form
      this.plRelease.plProjects.forEach(value => value.form = this.createProjectForm(value));
    } else {
      this.plRelease.plProjects = [];
      this.plCustomerForm.disable({ emitEvent: false });
    }
    this.plCustomerForm.markAsPristine();
    this.plReleaseForm.markAsPristine();
  }

  installEvent() {
    this.plReleaseForm.controls.activeBool.valueChanges.subscribe((activeBool) => {
      if (this.plReleaseForm.controls.activeBool.dirty) {
        this.plReleaseForm.controls.active.setValue(
          activeBool ? CommonConstants.Status.Active : CommonConstants.Status.Inactive
        );
      }
    });
  }

  createProjectForm(project: PlProject) {
    const fg = this.fb.group({
      projCode: [null, [Validators.required, Validators.maxLength(3)]]
      , projName: [null, [Validators.required, Validators.maxLength(200)]]
      , projDate: [null]
      , reqByCust: [null, [Validators.maxLength(6)]]
      , price: [null]
      , addWorkload: [null]
      , respEmp: [null, [Validators.maxLength(6)]]
      , active: [CommonConstants.Status.Active]
      , activeBool: [true]
      , rowVersion: [null]
      , guid: Guid.raw()
    });
    project.guid = fg.controls.guid.value;
    project.activeBool = project.active === CommonConstants.Status.Active;
    fg.patchValue(project, { emitEvent: false });
    // disabled PlProject pk
    if (project.rowState === RowState.Normal) {
      fg.controls.projCode.disable({ emitEvent: false });
    }
    // installEvent for all controls
    fg.valueChanges.subscribe((controls) => {
      if (project.rowState === RowState.Normal) {
        project.rowState = RowState.Edit;
      }
    });
    // installEvent for active Y/N
    fg.controls.activeBool.valueChanges.subscribe(activeBool => {
      if (fg.controls.activeBool.dirty) {
        fg.controls.active.setValue(activeBool ? CommonConstants.Status.Active : CommonConstants.Status.Inactive);
      }
    });
    if (project.rowVersion) {
      fg.markAsPristine();
    }
    return fg;
  }

  addProject() {
    const project: PlProject = {
      custCode: null
      , releaseCode: null
      , projCode: null
      , projName: null
      , projDate: null
      , refModNo: null
      , reqByCust: null
      , busFuncCode: null
      , respEmp: null
      , planStartDate: null
      , planFinishDate: null
      , estimateLoad: null
      , addWorkload: null
      , projPrice: null
      , currencyCode: null
      , remark: null
      , confirmDate: null
      , cancelled: null
      , buCode: null
      , mprojEmp: null
      , active: CommonConstants.Status.Active
      , activeBool: true
      , rowVersion: null
      , guid: Guid.raw()
      , rowState: RowState.Add
    };
    project.form = this.createProjectForm(project);
    this.plRelease.plProjects = this.plRelease.plProjects.concat(project);
    this.plReleaseForm.markAsDirty();
  }

  removeProject(detail: PlProject) {
    if (detail.rowState !== RowState.Add) {
      detail.rowState = RowState.Delete;
      this.plProjectDelete.push(detail);
    }
    this.plRelease.plProjects = this.plRelease.plProjects.filter(item => item.guid !== detail.guid);
    this.plReleaseForm.markAsDirty();
  }

  save() {
    const forms: FormGroup[] = [this.plReleaseForm].concat(this.plRelease.plProjects.map(detail => detail.form));
    if (this.util.isFormGroupsValid(forms) && this.isFormValid()) {
      this.saving = true;
      this.pl.save(this.plRelease, this.plReleaseForm.getRawValue(), this.plProjectDelete).pipe(
        switchMap(result => this.pl.findPlReleaseByKey(result.custCode, result.releaseCode)),
        finalize(() => this.saving = false)
      ).subscribe((result) => {
        this.plRelease = result;
        this.rebuildForm();
        this.ms.success('message.STD00006');
      });
    }
  }

  isFormValid(): boolean {
    let isValidated = true;
    if (this.plRelease.plProjects.length === 0) {
      this.ms.warning('message.STD00012', ['label.PLRT02.ProjectData']);
      isValidated = false;
    }
    return isValidated;
  }

  isFormDirty(): boolean {
    return this.plReleaseForm.dirty
      || this.plCustomerForm.dirty
      || this.plRelease.plProjects.some(item => item.form.dirty);
  }

  canDeactivate(): Observable<boolean> {
    if (!this.isFormDirty()) {
      return of(true);
    }
    return this.modal.confirm('message.STD00002');
  }

  onSearchGroupCust = (keyword, value) => {
    return this.pl.findGroupReleaseATC(keyword, value);
  }
}
