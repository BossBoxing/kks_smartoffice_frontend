import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AttachmentUrlComponent } from './attachment-url.component';

describe('AttachmentUrlComponent', () => {
  let component: AttachmentUrlComponent;
  let fixture: ComponentFixture<AttachmentUrlComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AttachmentUrlComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AttachmentUrlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
