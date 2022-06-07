import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InputDatatableComponent } from './input-datatable.component';

describe('InputDatatableComponent', () => {
  let component: InputDatatableComponent;
  let fixture: ComponentFixture<InputDatatableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InputDatatableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InputDatatableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
