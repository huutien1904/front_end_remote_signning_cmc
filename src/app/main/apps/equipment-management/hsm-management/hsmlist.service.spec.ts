import { TestBed } from '@angular/core/testing';

import { HsmlistService } from './hsmlist.service';

describe('HsmlistService', () => {
  let service: HsmlistService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HsmlistService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
