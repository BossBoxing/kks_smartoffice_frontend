import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BaseService } from '@app/shared';

@Injectable()
export class ReportFincService extends BaseService {
    constructor(
      private http: HttpClient
      ) { super(); }
}
