import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TableGroupComponent } from './table-group.component';

describe('TableGroupComponent', () => {
  let component: TableGroupComponent;
  let fixture: ComponentFixture<TableGroupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TableGroupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TableGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
