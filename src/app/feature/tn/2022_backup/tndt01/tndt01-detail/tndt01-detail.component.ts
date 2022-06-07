import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-tndt01-detail',
  templateUrl: './tndt01-detail.component.html',
  styleUrls: ['./tndt01-detail.component.css'],
})
export class Tndt01DetailComponent implements OnInit {
  startMonth = 2;
  lastMonth = 5;
  month = [
    { id: 1, name: 'มกราคม' },
    { id: 2, name: 'กุมภาพันธ์' },
    { id: 3, name: 'มีนาคม' },
    { id: 4, name: 'เมษายน' },
    { id: 5, name: 'พฤษภาคม' },
    { id: 6, name: 'มิถุนายน' },
    { id: 7, name: 'กรกฏาคม' },
    { id: 8, name: 'สิงหาคม' },
    { id: 9, name: 'กันยายน' },
    { id: 10, name: 'ตุลาคม' },
    { id: 11, name: 'พฤศจิกายน' },
    { id: 12, name: 'ธันวาคม' },
  ];

  inputMonth1: any = new FormControl(1);
  inputMonth2: any = new FormControl(6);
  month2: any = this.month;
  selectMonth = [];
  constructor() {}

  ngOnInit(): void {
    // console.log(this.month);
    const month1 = this.month;
    console.log(month1);
    this.inputMonth1.valueChanges.subscribe((input: any) => {
      if (this.inputMonth1.dirty) {
        if (input) {
          this.month2 = this.month.filter((row: any) => row.id >= input);
          this.inputMonth2.setValue(input);
        }
      }
    });
  }
}
