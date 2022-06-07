import { ValidatorFn, AbstractControl, Validators, FormGroup} from '@angular/forms';
import { BaseList, RowState } from '..';

export class CustomValidators extends Validators {

    static phoneNo(): ValidatorFn {
        return (control: AbstractControl): { [key: string]: any } | null => {
            if (control.value) {
                if (new RegExp('[0-9-#,]+$').test(control.value) === false) {
                    return { phoneNo: true };
                }
            }
            return null;
        };
    }

    static numberAndDash(): ValidatorFn {
        return (control: AbstractControl): { [key: string]: boolean } | null => {
          if (control.value) {
            if (new RegExp('[0-9-]+$').test(control.value) === false) {
                return { numberDash: true };
            }
          }
          return null;
        };
      }

    static numberOnly(): ValidatorFn {
        return (control: AbstractControl): { [key: string]: any } | null => {
            if (control.value) {
                if (new RegExp('^[0-9]+$').test(control.value) === false) {
                    return { number: true };
                }
            }
            return null;
        };
    }

    static idCard(): ValidatorFn {
        return (control: AbstractControl): { [key: string]: any } | null => {
            if (control.value) {
                if (new RegExp('^[0-9]+$').test(control.value) === false) {
                    return { number: true };
                } else if (String(control.value).length !== 13) {
                    return { exact: { length: String(control.value).length, requiredLength: 13 } };
                }
            }
            return null;
        };
    }

    static passport(): ValidatorFn {
        return (control: AbstractControl): { [key: string]: any } | null => {
            if (control.value) {
                if (new RegExp('^(?!^0+$)[a-zA-Z0-9]{3,20}$').test(control.value) === false) {
                    return { passport: true };
                }
            }
            return null;
        };
    }

    static fixLength(length: number): ValidatorFn {
        return (control: AbstractControl): { [key: string]: any } | null => {
            if (control.value) {
                if (String(control.value).length !== length) {
                    return { exact: { length: String(control.value).length, requiredLength: length } };
                }
            }
            return null;
        };
    }

    static duplicate(rows: BaseList[]): ValidatorFn {
        return (control: AbstractControl): { [key: string]: any } | null => {
            if (control.value && rows && rows.length > 0) {
                const controls = control.parent ? control.parent.controls : null;
                if (controls) {
                    const controlName = Object.keys(controls).find(name => control === controls[name]) || null;
                    if (controlName) {
                        const guid = 'guid';
                        if (rows.some(row => row.rowState !== RowState.Delete
                                && row.form && row.form.controls
                                && row.form.controls[guid].value !== controls[guid].value
                                && row.form.controls[controlName].value === control.value)) {
                            return { duplicate: true };
                        }
                    }
                }
            }
            return null;
        };
    }

    static duplicateMultiKey(rows: BaseList[], controlNameKeys: string[]): ValidatorFn {
        return (control: AbstractControl): { [key: string]: any } | null => {
            if (control.value && rows && rows.length > 0) {
                const controls = control.parent ? control.parent.controls : null;
                if (controls) {
                    const controlNames = Object.keys(controls);
                    const controlName = controlNames.find(name => control === controls[name]) || null;
                    if (controlName && controlNameKeys.every(ctrlName => controlNames.includes(ctrlName))) {
                        const guid = 'guid';
                        const otherRowValues = [];
                        let thisRowValue;
                        rows.filter(row => row.rowState !== RowState.Delete && row.form && row.form.controls).forEach(row => {
                            let testKey = {};
                            controlNameKeys.forEach(key => {
                                testKey = Object.assign(testKey, {
                                    [key]: row.form.controls[key].value
                                });
                            });
                            if (row.form.controls[guid].value === controls[guid].value) {
                                thisRowValue = JSON.stringify(testKey);
                            } else {
                                otherRowValues.push(JSON.stringify(testKey));
                            }
                        });
                        if (otherRowValues.includes(thisRowValue)) {
                            return { duplicate: true };
                        }
                    }
                }
            }
            return null;
        };
    }

    static userName(): any {
        return (control: AbstractControl): { [key: string]: any } | null => {
            if (control.value) {
                /****
                 * 1. Start with a-z
                 * 2. Only a-z lowwer case
                 * 3. Can habe number 0-9
                 * 4. Can have: -, _
                 *  */
                if (new RegExp('^[a-z]+[a-z0-9_-]+$').test(control.value) === false) {
                    return { userName: true };
                }
            }
            return null;
        };
    }

    static matched(controlNameA: string, controlNameB: string) {
        return (group: FormGroup): {[key: string]: any} => {
          // get values
          const valueA = group.get(controlNameA).value;
          const valueB = group.get(controlNameB).value;
          return valueA === valueB ? null : { matched: true };
        };
      }
}
