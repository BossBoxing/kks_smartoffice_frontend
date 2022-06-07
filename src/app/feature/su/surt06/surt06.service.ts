import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BaseList, BaseService, Page, RowState } from '@app/shared';
import { FormGroup } from '@angular/forms';

export interface SuUser {
    id: number;
    userId: number;
    userName: string;
    password: string;
    profileId: number;
    description: string;
    address: string;
    telephone: string;
    email: string;
    status: number;
    hrId: string;
    logonUnit: string;
    divCode: string;
    empId: string;
    normalLogMode: string;
    currentLogMode: string;
    lastChangePwdDate: Date;
    nextExpiredPwdDate: Date;
    employeeEmail: string;
    accountExpireDate: Date;
    lastChangeReason: string;
    lastLdapUpdDate: Date;
    lastLoginDate: Date;
    userInactiveDate: Date;
    userAdDefPwd: string;
    ouCode: string;
    forceFlag: string;
    forceBool: boolean;
    lockFlag: string;
    inactive: string;
    unlimitFlag: string;
    unlimitBool: boolean;
    userLin: string;
    userIdMap: string;
    failTime: string;
    logonOu: string;
    userImage: string;
    active: string;
    activeBool: boolean;
    ouName: string;
    divName: string;
    userProfiles: SuUserProfile[];
    userOrgs: SuUserOrg[];
    userOrgDto: SuUserOrg[];
    empName: string;
    rowVersion: number;
    rowState: RowState;
    orgOuCode: string;
}

export interface PasswordDto {
    userId: number;
    isChangePassword: boolean;
    isResetPassword: boolean;
    oldPassword: string;
    newPassword: string;
    confirmPassword: string;
    rowVersion: number;
    rowState: RowState;
}

export interface SuUserProfile extends BaseList {
    userId: number;
    profileId: number;
    effDate: Date;
    endDate: Date;
    rowVersion: number;
}

export interface SuUserOrg extends BaseList {
    userId: number;
    userName: string;
    empName: string;
    ouCode: string;
    effDate: Date;
    endDate: Date;
    rowVersion: number;
    userOrgUnits: SuUserOrgUnit[];
    userOrgUnitDto: SuUserOrgUnit[];
}

export interface SuUserOrgUnit extends BaseList {
    userId: number;
    ouCode: string;
    divCode: string;
    isSelected: boolean;
    effDate: Date;
    endDate: Date;
    rowVersion: number;
}

export class SuUserOrgUnits extends BaseList {
    userId: number;
    ouCode: string;
    divCode: string;
    isSelected: boolean;
    effDate: Date;
    endDate: Date;
    rowVersion: number;
}

@Injectable()
export class Surt06Service extends BaseService {
    constructor(private http: HttpClient) {
        super();
    }

    findMasterData(page: string) {
        return this.http.get<any>('surt06/master', { params: { page }});
    }

    findSuUsers(searchCriteria: any, page: any) {
        const filter = Object.assign(searchCriteria, page);
        return this.http.get<any>('surt06', { params: filter });
    }

    findSuUserByKey(userId, ReadOnly: boolean = false) {
        return this.http.get<SuUser>('surt06/detail', { params: { userId, readOnly: ReadOnly.toString() }});
    }

    findSuUserOrgByKey(ouCode, userId, ReadOnly: boolean = false) {
        return this.http.get<SuUser>('surt06/organization', { params: { ouCode, userId, readOnly: ReadOnly.toString() }});
    }

    findEmpIdForATC(keyword: string, value: string, param: any) {
        return this.http.get<any>('surt06/findEmpIdForATC', { params: Object.assign({ keyword, value }, param) });
    }

    findOuCodeForATC(keyword: string, value: string, param: any) {
        return this.http.get<any>('surt06/findOuCodeForATC', { params: Object.assign({ keyword, value }, param) });
    }

    findSuDivisions(param: any) {
        return this.http.get<any>('surt06/divisions', { params: param });
    }

    save(
        suUser: SuUser,
        formGroup: FormGroup,
        userProfilesDelete: SuUserProfile[],
        userOrgsDelete: SuUserOrg[]) {
        const user = Object.assign({}, suUser, formGroup);
        user.userProfiles = this.prepareSaveList(user.userProfiles, userProfilesDelete);
        user.userOrgDto = this.prepareSaveList(user.userOrgDto, userOrgsDelete);
        if (user.rowVersion) {
            return this.http.put<any>('surt06', user);
        } else {
            return this.http.post<any>('surt06', user);
        }
    }

    saveOranization(
        user: SuUser,
        userOrg: SuUserOrg,
        userOrgForm: FormGroup
    ) {
        const suUserOrg = Object.assign({}, userOrg, userOrgForm);
        user.userProfiles = [];
        user.userOrgDto = [].concat(suUserOrg);
        return this.http.put<any>('surt06', user);
    }

    changePassword(passwordDto: PasswordDto, passwordForm: FormGroup) {
        const password = Object.assign({}, passwordDto, passwordForm);
        return this.http.put<any>('surt06/password', password);
    }

    resetPassword(passwordDto: PasswordDto, passwordForm: FormGroup) {
        const password = Object.assign({}, passwordDto, passwordForm);
        return this.http.put<any>('surt06/password', password);
    }
}
