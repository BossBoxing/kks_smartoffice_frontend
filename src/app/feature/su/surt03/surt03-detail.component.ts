import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { SuMenuInfo, Surt03Service } from './surt03.service';
import { ActivatedRoute } from '@angular/router';
import { FormUtilService, ModalService } from '@app/shared';
import { CanComponentDeactivate, MessageService } from '@app/core';
import { switchMap, finalize } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { BasicForm } from '@app/shared/component/base-form';

@Component({
  selector: 'app-surt03-detail',
  templateUrl: './surt03-detail.component.html'
})
export class Surt03DetailComponent implements OnInit, CanComponentDeactivate {
  menuForm: FormGroup;
  suMenu: SuMenuInfo = {} as SuMenuInfo;
  saving = false;
  masterData = {
    systemCodes: [],
    mainMenus: [],
    programCodes: []
  };
  permission = {
    isReadOnly: null
  };

  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    public util: FormUtilService,
    private ms: MessageService,
    private modal: ModalService,
    private su: Surt03Service
  ) { }

  ngOnInit() {
    this.createForm();
    this.route.data.subscribe((data) => {
      this.suMenu = data.surt03.detail;
      this.initialMasterData (data);
      this.rebuildForm();
    });
  }

  initialMasterData(data: any) {
    this.masterData = data.surt03.masterData;
  }

  createForm() {
    this.menuForm = this.fb.group({
      systemCode: [null, [Validators.required]],
      mainMenu: null,
      menuCode: [null, [Validators.required, Validators.maxLength(20)]],
      programCode: null,
      icon: [null, [Validators.required, Validators.maxLength(50)]],
      active: true,
      menuNameTh: [null, [Validators.required, Validators.maxLength(200)]],
      menuNameEn: [null, [Validators.required, Validators.maxLength(200)]],
      rowVersionMenuTh: null,
      rowVersionMenuEn: null,
    });
  }

  rebuildForm() {
    this.menuForm.markAsPristine();
    if (this.suMenu.rowVersion) {
      this.menuForm.patchValue(this.suMenu);
      this.menuForm.controls.systemCode.disable({emitEvent: false});
      this.menuForm.controls.menuCode.disable({emitEvent: false});
    }
    if (this.isReadOnly()) {
      this.menuForm.disable({emitEvent: false});
    }
    this.menuForm.markAsPristine();
  }

  onSearchMainMenu = (keyword, value) => {
    return this.su.findMainMenuForATC(keyword, value
      , { active: true, menuCode: this.menuForm.controls.menuCode.value }
    );
  }

  isReadOnly(): boolean {
    return this.permission.isReadOnly;
  }

  save() {
    if (this.util.isFormGroupValid(this.menuForm)) {
      this.saving = true;
      this.su.save(this.suMenu, this.menuForm.getRawValue()).pipe(
        switchMap(result => this.su.findSuMenuInfoByKeys(result.menuCode)),
        finalize(() => this.saving = false)
      ).subscribe((result) => {
        this.suMenu = result;
        this.rebuildForm();
        this.ms.success('message.STD00006');
      });
    }
  }

  isFormDirty(): boolean {
    return this.menuForm.dirty;
  }

  canDeactivate(): Observable<boolean> {
    if (!this.isFormDirty()) {
      return of(true);
    }
    return this.modal.confirm('message.STD00002');
  }
}
