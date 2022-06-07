import { ValidatorFn, AbstractControl } from '@angular/forms';

export function idCardPattern(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
        if (control.value) {
            if (control.value.length !== 13) {
                return { 'exact': { length: control.value.length, requiredLength: 13 } }
            }
            else {
                const isId = validDigit(control.value);
                return isId ? null : { 'pattern': { value: control.value } };
            }
        }
    };
}

export function validDigit(value) {
    let checkSum = 0;
    let result = 0;
    for (let i = 0; i < value.length - 1; i++) {
        checkSum = checkSum + (Number(value[i]) * (value.length - i));
    }
    result = (11 - (checkSum % 11)) % 10;
    return result === Number(value[12]);
}