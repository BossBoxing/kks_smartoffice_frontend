import { Component, OnInit } from '@angular/core';
import { FormUtilService, ModalService, Page } from '@app/shared';
import { Surt03Service, SuUser } from './surt03.service';
import { TranslateService } from '@ngx-translate/core';
import { CommonConstants } from '@app/feature/common/common-constants';
import { forkJoin } from 'rxjs';
import { finalize, map, switchMap } from 'rxjs/operators';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessageService } from '@app/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-surt03',
  templateUrl: './surt03.component.html',
  styleUrls: ['./surt03.component.scss']
})
export class Surt03Component implements OnInit {
  public static readonly programCode = 'surt03';
  url = 'D:\\smartkks\\smartkks-core\\Web\\spa\\src\\assets\\images\\no-profile-256.png';
  suUser: SuUser = {} as SuUser;
  suUserForm: FormGroup;
  saving = false;
  genderItems = [
    { value: '-', text: 'ไม่ระบุ', description: '', active: true },
    { value: 'M', text: 'ผู้ชาย', description: 'description1', active: true },
    { value: 'F', text: 'ผู้หญิง', description: 'description2', active: true },
  ];
  // sexItemsAddMode = [];
  radioStatus = [{  value: CommonConstants.Status.Active, text: '' }
               , { value: CommonConstants.Status.Inactive, text: '' }
               , { value: CommonConstants.Status.All, text: '' }];
  constructor(
    private service: Surt03Service,
    private translate: TranslateService,
    public util: FormUtilService,
    private modal: ModalService,
    private fb: FormBuilder,
    private ms: MessageService,
    private router: Router,
  ) {}
  ngOnInit(): void {
    this.createForm();
    this.genderItems = this.util.getActive(this.genderItems, null);
    this.service.findUsers().subscribe((Response) => {
      this.suUser = Response.rows;
      forkJoin([
        this.translate.get('label.ALL.Active'),
        this.translate.get('label.ALL.Inactive'),
        this.translate.get('label.ALL.All')]
      ).pipe(map(result => {
        this.radioStatus[0].text = result[0];
        this.radioStatus[1].text = result[1];
        this.radioStatus[2].text = result[2];
      })).subscribe();
      this.rebuildForm();
      });
    }
  createForm() {
    this.suUserForm = this.fb.group({
      id: [null , Validators.maxLength(5)],
      sex: null ,
      userName: [null , [Validators.required, Validators.maxLength(20)]],
      description: [null , Validators.maxLength(30)],
      preNameId: [null , Validators.maxLength(3)],
      tFirstName: [null , [Validators.required, Validators.maxLength(40)]],
      tLastName: [null , [Validators.required, Validators.maxLength(40)]],
      eFirstName: [null , [Validators.required, Validators.maxLength(40)]],
      eLastName: [null , [Validators.required, Validators.maxLength(40)]],
      position: [null , Validators.maxLength(30)],
      address: [null , Validators.maxLength(300)],
      telephone: [null , [Validators.required, Validators.maxLength(10), Validators.pattern('^[0-9]*$')]],
      email: [null , [Validators.required, Validators.maxLength(100), Validators.email]],
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
    if (this.isFormValid()) {
      this.saving = true;
      this.service.save(this.suUser , this.suUserForm.getRawValue()).pipe(
        switchMap(result => this.service.findsuUserByKey(result.id)),
        finalize(() => this.saving = false)
      ).subscribe((result) => {
        this.suUser[0] = result.rows;
        this.rebuildForm();
        this.ms.success('message.STD00006');
      });
    }
  }

  rebuildForm() {
    this.suUserForm.markAsPristine();
    if (this.suUser[0].rowVersion) {
      this.suUser.activeBool = this.suUser.active === CommonConstants.Status.Active;
      this.suUserForm.patchValue(this.suUser[0]);
      this.suUserForm.controls.id.disable({emitEvent: false});
    }
    this.suUserForm.markAsPristine();
  }

  onSearchGetPreNameFromId = (Keyword, value) => {
    return this.service.findPreNameIdForAtc(Keyword, value);
  }

  onSearchGetPosition = (Keyword, value) => {
    return this.service.findPositionForAtc(Keyword, value);
  }
  isFormValid(): boolean {
    return this.util.isFormGroupValid(this.suUserForm);
  }

  isFormDirty(): boolean {
    return this.suUserForm.dirty;
  }

}
