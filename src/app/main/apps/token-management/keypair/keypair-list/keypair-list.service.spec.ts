import { TestBed } from '@angular/core/testing';

import { KeypairListService } from './keypair-list.service';

describe('KeypairListService', () => {
  let service: KeypairListService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(KeypairListService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
