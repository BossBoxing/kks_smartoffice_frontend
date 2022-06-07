import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LookupMultipleComponent } from './lookup-multiple.component';

describe('LookupMultipleComponent', () => {
  let component: LookupMultipleComponent;
  let fixture: ComponentFixture<LookupMultipleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LookupMultipleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LookupMultipleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
