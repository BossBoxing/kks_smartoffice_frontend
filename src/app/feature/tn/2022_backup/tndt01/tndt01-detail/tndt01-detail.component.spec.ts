import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Tndt01DetailComponent } from './tndt01-detail.component';

describe('Tndt01DetailComponent', () => {
  let component: Tndt01DetailComponent;
  let fixture: ComponentFixture<Tndt01DetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Tndt01DetailComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Tndt01DetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
