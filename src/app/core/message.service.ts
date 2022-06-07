import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';
import { forkJoin } from 'rxjs';
import { switchMap, map } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class MessageService {
    constructor(private toastr: ToastrService, private translate: TranslateService) {
    }

    private arrayToObject = (array = []) =>
        array.reduce((obj, item, index) => {
            obj[index] = item;
            return obj
        }, {})

    translatedParams(params = []) {
        return forkJoin(params.map(item => this.translate.get(item))).pipe(
            map((params: Array<string>) => this.arrayToObject(params))
        )
    }

    private translatedMessage(message, params: any[] = null) {
        return params != null && params.length > 0 ? this.translatedParams(params).pipe(
            switchMap(translated => this.translate.get(message, translated))
        ) : this.translate.get(message);
    }

    info(message, params = null) {
        this.translatedMessage(message, params).subscribe((translated) => this.toastr.info(translated, "ข้อมูล"));
    }

    success(message, params = null) {
        this.translatedMessage(message, params).subscribe((translated) => this.toastr.success(translated, "เสร็จสิ้น"));
    }

    error(message, params = null, timeout = 5000) {
        this.translatedMessage(message, params).subscribe((translated) => this.toastr.error(translated, "พบข้อผิดพลาด",{ timeOut:timeout}));
    }

    warning(message, params = null) {
        this.translatedMessage(message, params).subscribe((translated) => this.toastr.warning(translated, "แจ้งเตือน"));
    }
}