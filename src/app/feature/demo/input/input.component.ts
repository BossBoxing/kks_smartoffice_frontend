import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { StatusColor, FormUtilService, idCardPattern } from '@app/shared';
import { TextRangeValidator } from '@app/shared/directive/compare.directive';
import { LookupDemoComponent } from './lookup-demo/lookup-demo.component';
import { LookupDemoService } from './lookup-demo/lookup-demo.service';
import { of } from 'rxjs';
import { InputService } from './input.service';
import { AuthService } from '@app/core';
import { map } from 'rxjs/operators';
 
@Component({
  selector: 'app-input',
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.scss']
})
export class InputComponent implements OnInit {

  constructor(
    private fb: FormBuilder,
    private is:InputService,
    private auth:AuthService,
    private util:FormUtilService) { }
  inputForm: FormGroup;
  submited: boolean = false;
  color = StatusColor;
  radioItems = [{ value: '01', text: 'radio1', disabled: true }, { value: '02', text: 'radio2' }, { value: '03', text: 'radio3' }]
  selectItems = [
    { value: '01', text: 'select1', description: 'description1',active:true },
    { value: '02', text: 'select2', description: 'description2',active:false },
    { value: '03', text: 'select3', description: 'description3',active:false }
  ]
  selectItemsAddMode = [];
  selectItemsEditMode = [];

  LookupDemoComponent = LookupDemoComponent;
  LookupDemoService = LookupDemoService;
  lookupParam:any;
  
  ngOnInit() {
    this.createForm();
    this.selectItemsAddMode = this.util.getActive(this.selectItems,null);
    this.selectItemsEditMode = this.util.getActive(this.selectItems,'02');
  }
  createForm() {

    this.inputForm = this.fb.group({
      text: null,
      textTo: null,
      email:[null,Validators.email],
      phone:[null,Validators.pattern('[0-9-#,]*')],
      idCard:[null,idCardPattern()],
      integer: [2000, [Validators.min(100), Validators.max(5000)]],
      number: [2200.1, [Validators.min(100), Validators.max(5000)]],
      checkbox: true,
      date: ['2019-11-01T11:44:05.447403+07:00', Validators.required],
      dateTo: [null],
      time: ['12:11'],
      radio: '02',
      lookup: [null, Validators.required],
      select: [null, Validators.required],
      selectDesc: ['02', Validators.required],
      auto:15,
      autoDesc:null,
      image:876,
      file: null,
      year: [2000, [Validators.required, Validators.max(4000)]],
      area: null,
    }, { validators: TextRangeValidator("text", "textTo", "textrange") });

    this.inputForm.valueChanges.subscribe(
      val => console.log(val)
    )
    this.inputForm.controls.select.valueChanges.subscribe(()=>this.onLookupParamChange());
  }

  onLookupParamChange(){
    this.lookupParam = {
      parentCode: this.inputForm.controls.select.value
    }
  }

  onSearchAutocomplete = (term,value) =>{
     return this.is.getAutoComplete(term,value).pipe(
       map(auto=>auto.countries)
     );
  }

  onSubmit() {
    console.log(this.inputForm.controls.date.value);
    this.submited = true;
  }
  
  clear() {
    this.createForm();
  }
}
