import { Component, OnInit, Input } from '@angular/core';
import { StatusColor } from './color';


@Component({
  selector: 'status',
  templateUrl: './status.component.html',
  styleUrls: ['./status.component.scss']
})
export class StatusComponent implements OnInit {
  @Input() hasLabel:boolean = true;
  @Input() small:boolean = false;
  @Input() status:string = null;
  @Input() color:StatusColor = StatusColor.PRIMARY;
  @Input() disableColor:boolean = false;

  constructor() { }

  ngOnInit() {
    if (this.disableColor) {
      this.color = StatusColor.DISABLE;
    }
    if (this.status === undefined) {
      this.status = ' ';
    }
  }

  getTextColorByBg(colorCode) {
    const rgb = this.hexToRgb(colorCode);
    if (rgb) {
      const brightness = ((rgb.red * 299) + (rgb.green * 587) + (rgb.blue * 114)) / 255000;
      // values range from 0 to 1
      // anything greater than 0.5 should be bright enough for dark text
      if (brightness >= 0.5) {
        return '#000000'; // black
      } else {
        return '#ffffff'; // white
      }
    } else {
      return '#ffffff'; // white
    }
  }

  hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      red: parseInt(result[1], 16),
      green: parseInt(result[2], 16),
      blue: parseInt(result[3], 16)
    } : null;
  }

}
