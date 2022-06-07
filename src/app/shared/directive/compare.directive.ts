import { ValidatorFn, FormGroup } from '@angular/forms';

export function TextRangeValidator(from: string, to: string, name: string): ValidatorFn {
    return (fg: FormGroup): Object | null => {
        const controlFrom = fg.get(from);
        const controlTo = fg.get(to);

        let start: any = controlFrom.value || null;
        let end: any = controlTo.value || null;

        let startInternal = null;
        let endInternal = null;

        let compare = {};
        try {
            if (start != null && end != null) {
                const isString = (typeof start === 'string' || start instanceof String) && (typeof end === 'string' || end instanceof String);
                const isNumber = (typeof start === 'number' && isFinite(start)) && (typeof end === 'number' && isFinite(end))

                const timeRegex = /[0-9]{1,2}:[0-9]{1,2}/;
                const isTime = isString && timeRegex.test(start) && timeRegex.test(end);
                if (isTime) {
                    startInternal = start.padEnd(8, ':00');
                    endInternal = end.padEnd(8, ':00');
                    start = start.match(timeRegex)[0];
                    end = end.match(timeRegex)[0];
                }
                else if (isString) {
                    const maxLength = Math.max(start.length, end.length);
                    startInternal = start.padStart(maxLength, '0');
                    endInternal = end.padStart(maxLength, '0');
                }

                if ((isString && startInternal.localeCompare(endInternal) > 0) || (isNumber && start > end)) {
                    controlFrom.setErrors({ compare: true }, { emitEvent: false });
                    controlTo.setErrors({ compare: true }, { emitEvent: false });
                    compare[name] = { start: start, end: end };
                    return compare;
                }
            }

            controlFrom.setErrors({ compare: null }, { emitEvent: false });
            controlTo.setErrors({ compare: null }, { emitEvent: false });
            controlFrom.updateValueAndValidity({ onlySelf: true, emitEvent: false });
            controlTo.updateValueAndValidity({ onlySelf: true, emitEvent: false });
            return null;
        }
        catch{
            return null;
        }
    };
}