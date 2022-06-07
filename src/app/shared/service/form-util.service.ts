import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Page } from '../component/datatable/page.model';
import { BaseList } from './base.service';
import { RowState } from '../component/datatable/state.enum';
import { MessageService } from '@app/core';

@Injectable()
export class FormUtilService {
    constructor(
          private ms: MessageService) {

    }
    markFormGroupTouched(formGroup: FormGroup) {
        (<any>Object).values(formGroup.controls).forEach(control => {
            control.markAsTouched();

            if (control.controls) {
                this.markFormGroupTouched(control);
            }
        });
    }

    focusInvalid(el) {
        const invalidElements = el.querySelectorAll('.ng-invalid');
        if (invalidElements.length > 0) {
            invalidElements[0].scrollIntoView(false);
        }
    }

    setPageIndex(page: Page, deletedCount: number = 1) {
        const index = Math.min(Math.ceil((page.totalElements - deletedCount) / page.size) - 1, page.index);
        page.index = index < 0 ? 0 : index;
        return page;
    }

    //hidden from dropdownlist 
    getActive(originals: any[], baseValue: any): any[] {
        let items = [];
        if (baseValue) {
            items = originals.reduce((result,row)=>{
                if(row.active || baseValue == row.value){
                   result.push(row);
                }
                return result;
            },[])
        }
        else {
            items = originals.reduce((result,row)=>{
                if(row.active){
                   result.push(row);
                }
                return result;
            },[])
        }
        return items;
    }

    isFormGroupValid(formGroup: FormGroup, showWarning: boolean = true, warnMessage: string = 'message.STD00045') {
        return this.isFormGroupsValid([formGroup], showWarning, warnMessage);
    }

    isFormGroupsValid(formGroups: FormGroup[], showWarning: boolean = true, warnMessage: string = 'message.STD00045') {
        let isInvalid = false;
        if (formGroups && formGroups.length > 0) {
            formGroups.forEach(formGroup => {
                this.markFormGroupTouched(formGroup);
                isInvalid = isInvalid || formGroup.invalid;
            });
        }
        if (isInvalid) {
            if (showWarning) {
                this.ms.warning(warnMessage);
            }
            return false;
        } else {
            return true;
        }
    }

    isDuplicateKeyAndWarning(rows: BaseList[], keys: string[], warnMessage: string[] = ['message.SQL23505']) {
        return this.isDuplicateKey(rows, keys, true , warnMessage);
    }

    isDuplicateKey(rows: BaseList[], keys: string[], showWarning: boolean = true, warnMessage: string[] = ['message.SQL23505']) {
        let isDup = false;
        const allKeyInList = [];
        rows.filter(row => row.rowState !== RowState.Delete).forEach(row => {
            if (row.form && isDup === false) {
                let allKeyInRow = {};
                keys.forEach(key => {
                    if (row.form.controls[key]) {
                        allKeyInRow = Object.assign(allKeyInRow , { [key]: row.form.controls[key].value });
                    }
                });
                const testKey = JSON.stringify(allKeyInRow);
                if (allKeyInList.includes(testKey)) {
                    isDup = true;
                } else {
                    allKeyInList.push(testKey);
                }
            }
        });
        if (isDup && showWarning) {
            if (warnMessage.length === 1) {
                this.ms.warning(warnMessage[0]);
            } else {
                this.ms.warning(warnMessage[0], warnMessage.filter((val, index) => index > 0));
            }
        }
        return isDup;
    }

    setDuplicateError(rows: BaseList[], keys: string[]) {
        const allKeyInList = [];
        const dupKeyInList = [];
        const checkRows = rows.filter(row => row.rowState !== RowState.Delete);
        checkRows.forEach(row => {
            if (row.form) {
                let allKeyInRow = {};
                keys.forEach(key => {
                    if (row.form.controls[key]) {
                        allKeyInRow = Object.assign(allKeyInRow , { [key]: row.form.controls[key].value });
                    }
                });
                const testKey = JSON.stringify(allKeyInRow);
                if (allKeyInList.includes(testKey)) {
                    if (dupKeyInList.includes(testKey) === false) {
                        dupKeyInList.push(testKey);
                    }
                }
                allKeyInList.push(testKey);
            }
        });
        if (dupKeyInList.length > 0) {
            checkRows.forEach(row => {
                let allKeyInRow = {};
                keys.forEach(key => {
                    if (row.form.controls[key]) {
                        allKeyInRow = Object.assign(allKeyInRow , { [key]: row.form.controls[key].value });
                    }
                });
                const testKey = JSON.stringify(allKeyInRow);
                keys.forEach(key => {
                    const control = row.form.controls[key];
                    if (dupKeyInList.includes(testKey)) {
                        control.setErrors({ duplicate: true });
                    } else {
                        if (control.hasError('duplicate')) {
                            control.setErrors({ duplicate: null });
                        }
                    }
                });
            });
        }
    }

}