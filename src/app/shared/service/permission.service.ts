import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class PermissionService {
    constructor(private http: HttpClient) { }

    getMenuPermission(ProgramCode: string) {
        return this.http.post<any>('menu/getPermission' , { programCode: ProgramCode } );
    }
}

export interface Permission {
    isReadOnly: boolean;
}
