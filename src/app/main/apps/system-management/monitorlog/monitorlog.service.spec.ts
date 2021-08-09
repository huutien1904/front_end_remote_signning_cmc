import { TestBed } from '@angular/core/testing';

import { MonitorlogService } from './monitorlog.service';

describe('MonitorlogService', () => {
  let service: MonitorlogService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MonitorlogService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
