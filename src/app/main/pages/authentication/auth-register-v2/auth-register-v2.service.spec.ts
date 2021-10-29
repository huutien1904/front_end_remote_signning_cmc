import { TestBed } from '@angular/core/testing';

import { AuthRegisterV2Service } from './auth-register-v2.service';

describe('AuthRegisterV2Service', () => {
  let service: AuthRegisterV2Service;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AuthRegisterV2Service);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
