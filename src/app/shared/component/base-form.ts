import { ControlValueAccessor, NgControl, FormControl } from '@angular/forms'
import { DoCheck, EventEmitter, Input, Output, Optional, Self } from '@angular/core'
import { Guid } from 'guid-typescript'
import { ReportParam } from '../service/report.service';

export abstract class BaseFormField implements ControlValueAccessor, DoCheck {
    @Input() value: any = null;
    @Input() disabled: boolean;
    @Input() placeholder = '';
    @Input() hasLabel = true;
    @Input() small = false;
    @Input() class = '';
    @Output() change = new EventEmitter<any>()

    // generate a unique id for each control
    id = Guid.raw();
    required = false

    onChange = (value: any) => { }
    onTouched = () => { }

    constructor(@Optional() @Self() public controlDir: NgControl) {
        if (controlDir) {
            // bind the CVA to our control
            controlDir.valueAccessor = this
        }
    }

    get control() {
        return this.controlDir && this.controlDir.control instanceof FormControl ? this.controlDir.control : null;
    }
    ngDoCheck() {
        if (this.control) {
            // check if this field is required or not to display a 'required label'
            const validator = this.control.validator && this.control.validator(new FormControl(''))
            this.required = Boolean(validator && validator.hasOwnProperty('required')) || Boolean(validator && validator.hasOwnProperty('selectedCount'))
        }
    }

    get hasErrors() {
        return (this.control && (this.control.touched || this.control.dirty) && this.control.errors)
    }

    // implementation of `ControlValueAccessor`
    writeValue(value: any): void { }

    registerOnChange(fn: any): void {
        this.onChange = fn
    }

    registerOnTouched(fn: () => void): void {
        this.onTouched = fn
    }

    setDisabledState(disabled: boolean): void {
        this.disabled = disabled
    }
}

export interface BasicForm {
    createForm: () => void;
    rebuildForm: () => void;
    installEvent: () => void;
    isFormDirty: () => boolean;
    isFormValid: () => boolean;
}

export interface FormLink {
    assignReportParam: () => void;
    reportParam: ReportParam;
}