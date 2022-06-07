import { TestBed } from '@angular/core/testing';

import { Tndt01Service } from './tndt01.service';

describe('Tndt01Service', () => {
  let service: Tndt01Service;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Tndt01Service);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
