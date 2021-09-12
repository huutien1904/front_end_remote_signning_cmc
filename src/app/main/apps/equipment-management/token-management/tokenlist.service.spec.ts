import { TestBed } from '@angular/core/testing';

import { TokenlistService } from './tokenlist.service';

describe('TokenlistService', () => {
  let service: TokenlistService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TokenlistService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
