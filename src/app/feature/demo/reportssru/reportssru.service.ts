import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { RowState, BaseService, BaseList} from '@app/shared';

import { FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';

@Injectable()
export class ReportSsruService extends BaseService {
    constructor(
      private http: HttpClient
      ) { super() }
}