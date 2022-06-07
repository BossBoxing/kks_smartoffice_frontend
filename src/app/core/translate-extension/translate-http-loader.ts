import { Observable, forkJoin } from 'rxjs';
import { TranslateLoader } from '@ngx-translate/core';
import { LazyTranslationService } from './lazy-translation.service';
import { map } from 'rxjs/operators';
import * as R from 'ramda';

export class TranslateHttpLoader implements TranslateLoader {
    constructor(private lazy: LazyTranslationService) { }
    /**
     * Gets the translations from the server
     */
    public getTranslation(lang: string): Observable<Object> {
        this.lazy.translationLoaded = true;
        // load translation of all added modules.
        const requests = this.lazy.loadByLang(lang);
        return forkJoin(requests).pipe(map(response =>{
            let res = R.reduce(R.mergeDeepRight,{},response);
            return res;
        }));
    }

    
}