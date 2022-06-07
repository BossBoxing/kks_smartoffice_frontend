import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Tndt01Component } from './tndt01.component';

describe('Tndt01Component', () => {
  let component: Tndt01Component;
  let fixture: ComponentFixture<Tndt01Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Tndt01Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Tndt01Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
