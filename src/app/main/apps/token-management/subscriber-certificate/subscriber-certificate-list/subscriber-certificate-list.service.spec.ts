import { TestBed } from '@angular/core/testing';

import { SubscriberCertificateListService } from './subscriber-certificate-list.service';

describe('SubscriberSertificateListService', () => {
  let service: SubscriberCertificateListService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SubscriberCertificateListService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
