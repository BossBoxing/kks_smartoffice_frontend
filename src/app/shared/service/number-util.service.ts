import { Injectable } from '@angular/core';

@Injectable()
export class NumberUtilService {

    constructor() {}

    add(num1: number = 0, num2: number = 0, scale: number = 2) {
        let result = 0;
        if (!isNaN(num1) && !isNaN(num2)) {
            result = ((num1 * 10) + (num2 * 10)) / 10;
        }
        return Math.round(result * Math.pow(10, scale)) / Math.pow(10, scale);
    }

    subtract(num1: number = 0, num2: number = 0, scale: number = 2) {
        let result = 0;
        if (!isNaN(num1) && !isNaN(num2)) {
            result = ((num1 * 10) - (num2 * 10)) / 10;
        }
        return Math.round(result * Math.pow(10, scale)) / Math.pow(10, scale);
    }
}
