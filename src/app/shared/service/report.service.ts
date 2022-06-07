import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { OrganizationService, I18nService, AuthService } from '@app/core';
import { environment } from '@env/environment';
import * as moment from 'moment';
import { map } from 'rxjs/operators';

export enum ContentType {
    PDF = 'pdf',
    EXCEL = 'xlsx'
}

export interface ReportParam {
    paramsJson: any;
    module: string;
    reportName: string;
    exportType: ContentType;
    autoLoadLabel?: string;
    verifyAuthFunc?: string;
    printTime?: Date;
}

@Injectable({ providedIn: 'root' })
export class ReportService {

    constructor(
        private http: HttpClient,
        private org: OrganizationService,
        private lang: I18nService,
        private authService: AuthService) { }
    serverUrl = `${environment['reportUrl']}`;

    download(resp: HttpResponse<Blob>) {
        const fileName = this.getFileNameFromResponseContentDisposition(resp);
        const downloadedFile = new Blob([resp.body], { type: this.getContentType(resp) });
        var downloadUrl = URL.createObjectURL(downloadedFile);
        var anchor = document.createElement("a");
        anchor.href = downloadUrl;
        anchor.target = '_blank';
        anchor.download = fileName;
        document.body.appendChild(anchor);
        anchor.click();

        document.body.removeChild(anchor);
        URL.revokeObjectURL(downloadUrl);
    }

    private getFileNameFromResponseContentDisposition(response) {
        const contentDisposition = response.headers.get('content-disposition') || '';
        const matches = /filename=([^;]+)/ig.exec(contentDisposition);
        const fileName = (matches[1] || 'untitled').replace(/"/g, '').trim();
        return fileName;
    };

    private getContentType(response) {
        return response.headers.get('content-type') || '';
    }

    generateReportBase64(param: ReportParam) {
        let company = "";
        this.org.company.subscribe(res => {
            company = res
        });
        let userName = "";
        this.authService.claims.subscribe(claim => {
            userName = claim.name;
        });
        this.formatDate(param.paramsJson);
        let objParam = {};
        objParam = param.paramsJson;
        objParam["ou_code"] = company;
        objParam["lin_id"] = this.lang.language;
        objParam["user_name"] = userName;
        objParam["ip_address"] = "";
        param.paramsJson = objParam;
        return this.http.disableApiPrefix().post(this.serverUrl + '/exportReportBase64', param, { responseType: 'text' });
    }

    generateReport(param: ReportParam) {
        let company = "";
        this.org.company.subscribe(res => {
            company = res
        });
        let userName = "";
        this.authService.claims.subscribe(claim => {
            userName = claim.name;
        });
        this.formatDate(param.paramsJson);
        let objParam = {};
        objParam = param.paramsJson;
        objParam["ou_code"] = company;
        objParam["lin_id"] = this.lang.language;
        objParam["user_name"] = userName;
        objParam["ip_address"] = "";
        param.paramsJson = objParam;
        console.log("paramReport ");
        console.log(param);
        return this.http.post('report/exportReport', param, { responseType: 'text' })
    }

    generateAndDownloadBase64(param: ReportParam) {
        return this.generateReportBase64(param).pipe(
            map(res => {
                if (res) {
                    if (param.exportType === ContentType.PDF) {
                        this.Download(this.getDownlaodPdfType() + res, param);
                    } else {
                        this.Download(res, param);
                    }
                }
            })
        ).toPromise();
    }

    getDownloadFileName(reportName, extension) {
        return reportName + '_' + moment().format('YYYYMMDDHHmmss') + '.' + extension;
    }

    getDownloadFileNameByParam(reportParam: ReportParam) {
        const printTime = reportParam.printTime ? moment(reportParam.printTime) : moment();
        return reportParam.reportName + '_' + printTime.format('YYYYMMDDHHmmss') + '.' + reportParam.exportType.toLowerCase();
    }

    getDownlaodPdfType() {
        return 'data:application/pdf;base64,';
    }

    async DownloadFile(data, reportName) {
        const a = document.createElement('a');
        a.href = data;
        a.download = reportName;
        a.click();
    }

    async Download(data, reportParam: ReportParam) {
        const a = document.createElement('a');
        a.href = data;
        a.download = this.getDownloadFileNameByParam(reportParam);
        a.click();
    }

    formatDate(params: any) {
        if (params) {
            Object.keys(params).forEach((key) => {
                if (params[key] instanceof Date) {
                    params[key] = moment(params[key]).format('DD/MM/YYYY');
                }
            });
        }
    }
}
