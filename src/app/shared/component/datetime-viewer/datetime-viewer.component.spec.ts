import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DateTimeViewerComponent } from './datetime-viewer.component';

describe('DateTimeViewerComponent', () => {
  let component: DateTimeViewerComponent;
  let fixture: ComponentFixture<DateTimeViewerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DateTimeViewerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DateTimeViewerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
