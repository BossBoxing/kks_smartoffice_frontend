import { Injectable, Injector } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Subject, Observable, of, timer } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { HttpService } from '../http/http.service';
import { I18nService, SupportedLanguages } from '../i18n.service';

@Injectable({
    providedIn: 'root'
})

export class LazyTranslationService {

    private modules: string[] = [];

    private loaded = false;

    get translationLoaded() {
        return this.loaded;
    }

    set translationLoaded(value: boolean) {
        this.loaded = value;
    }

    constructor(private injector: Injector) { }

    public add(module: string) {
        // do not add if already added.
        if (this.modules.includes(module)) { return; }

        this.modules.push(module);
        if (this.loaded) {
            this.load(module);
        }
    }

    private load(module: string) {
        const translate = this.injector.get(TranslateService);
        const i18n = this.injector.get(I18nService);
        i18n.onAfterTranslateLoaded.subscribe(() => {
            // tslint:disable-next-line:max-line-length
            const loadLang = (Object.keys(translate.translations)).length > 0 ? Object.keys(translate.translations) : [SupportedLanguages.Thai];
            loadLang.forEach(lang => {
                this.retrieve(module, lang).subscribe(result => {
                    translate.setTranslation(lang, result, true);
                });
            });
        });

    }

    loadByLang(lang) {
        return this.modules.map(module => {
            return this.retrieve(module, lang);
        });
    }

    private retrieve(module: string, lang: string): Observable<any> {
        const http = this.injector.get(HttpService);
        return http.skipErrorHandler().disableHeader().get(`localize/${module.toUpperCase()}/${lang}`).pipe(
            catchError(res => of({}))
        );
    }
}
