import { Injectable } from '@angular/core';
import { Observable, of, BehaviorSubject } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { catchError, map, first, switchMap, filter } from 'rxjs/operators';
import { Category } from './category';
import { ParameterService } from '@app/shared/service/parameter.service';
import * as CryptoJS from 'crypto-js';

export enum Type {
    Image = "Image",
    File = "File"
}

export interface Content {
    id: number,
    name: string,
    path: string | ArrayBuffer
}

export interface Path {
    contentUrl: string
}
@Injectable({
    providedIn: 'root'
})

export class ContentUploadService {

    private pathSub = new BehaviorSubject<Path>(null);
    pathObserv = this.pathSub.pipe(first(value => value != null));
    constructor(private http: HttpClient, private ps: ParameterService) {
        this.ps.getParameter("SU", "ShareContent").subscribe(path => {
            const result: Path = { contentUrl: path.ShareContent }
            this.pathSub.next(result);
        })
    }

    getContent(id) {
        const params = new HttpParams().set('id', encodeURIComponent(this.encryptId(id.toString())))
        return this.pathObserv.pipe(
            switchMap(path => this.http.disableApiPrefix().skipErrorHandler().get<Content>(`${path.contentUrl}api/content`, { params })),
            map(content => content || {} as Content),
            catchError(err => {
                return of({} as Content)
            })
        )
    }

    upload(file: File, type: Type, category: Category): Observable<any> {
        var formData: any = new FormData();
        formData.append("file", file);
        formData.append("category", category || Category.Example);
        return this.pathObserv.pipe(
            switchMap(path => this.http.disableApiPrefix().skipErrorHandler().post<Content>(`${path.contentUrl}api/content/${type}`, formData, {
                reportProgress: true,
                observe: 'events'
            })),
            map(content => content || {} as Content)
        )
    }

    private to2digit(n: number) {
        return ('00' + n).slice(-2);
    }
    private encryptSecretKey = "ssru@cts";
    private encryptId(id) {
        var date = new Date();
        let day = date.getDate();
        let month = date.getMonth() + 1;
        let year = date.getFullYear();
        var secretDate = `${this.to2digit(day)}/${this.to2digit(month)}/${year}`;
        var keySize = 256;
        var salt = CryptoJS.lib.WordArray.random(16);
        var key = CryptoJS.PBKDF2(this.encryptSecretKey+secretDate, salt, {
            keySize: keySize / 32,
            iterations: 100
        });
        var iv = CryptoJS.lib.WordArray.random(128 / 8);
        var encrypted = CryptoJS.AES.encrypt(id, key, {
            iv: iv,
            padding: CryptoJS.pad.Pkcs7,
            mode: CryptoJS.mode.CBC
        });
        var result = CryptoJS.enc.Base64.stringify(salt.concat(iv).concat(encrypted.ciphertext));
        return result;
    }
}