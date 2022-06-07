import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BaseList, BaseService } from '@app/shared';
import { FormGroup } from '@angular/forms';

export interface TaskEntryHistory {
  taskEntryYear: string;
  custCode: string;
  empCode: string;
  custColor: string;
  jan: number;
  feb: number;
  mar: number;
  apr: number;
  may: number;
  jun: number;
  jul: number;
  aug: number;
  sep: number;
  oct: number;
  nov: number;
  dec: number;
}

export interface TaTimeAttendance extends BaseList {
  taId: number;
  ouCode: string;
  empCode: string;
  workDate: Date;
  checkInTime: Date;
  checkInReason: string;
  checkOutTime: Date;
  checkOutReason: string;
  taType: string;
  rowVersion: number;
}

@Injectable()
export class DashboardService extends BaseService {

  constructor(
    private http: HttpClient
  ) {super(); }

  findMasterData() {
    return this.http.get<any>('dashboard/master');
  }

  findTaTimeAttendanceByUser() {
    return this.http.get<TaTimeAttendance>('dashboard/detail');
  }

  findPcTaskEntryForChart(taskEntryYear: string) {
    return this.http.get<any>('dashboard/findPcTaskEntryForChart', { params: { taskEntryYear }});
  }

  save( taTimeAttendance: TaTimeAttendance, timeAttendanceForm: FormGroup) {
    const taTimeAttendanceDto = Object.assign({}, taTimeAttendance, timeAttendanceForm);
    if (taTimeAttendanceDto.rowVersion) {
        return this.http.put<any>('dashboard', taTimeAttendanceDto);
    } else {
        return this.http.post<any>('dashboard', taTimeAttendanceDto);
    }
  }
}


