import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class AuditService {

  private programCode = null;
  private roleCode: string = null;


  get code(){
      return this.programCode;
  }

  set code(value){
      this.programCode = value;
  }

  get role(){
    return this.roleCode;
  }

  set role(value: string){
      this.roleCode = value;
  }

}