import { TestBed } from '@angular/core/testing';

import { CertificateRequestListService } from './certificate-request-list.service';

describe('CertificateRequestListService', () => {
  let service: CertificateRequestListService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CertificateRequestListService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
