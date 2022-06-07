import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BaseService } from '@app/shared';

@Injectable()
export class Plrp01Service extends BaseService {
    constructor(
      private http: HttpClient
    ) { super(); }

    findMasterData() {
      return this.http.get<any>('plrp01/master');
    }
}
