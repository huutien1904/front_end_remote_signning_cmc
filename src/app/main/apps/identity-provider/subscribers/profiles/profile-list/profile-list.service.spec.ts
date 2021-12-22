import { TestBed } from '@angular/core/testing';

import { ProfileListService } from './profile-list.service';

describe('ProfileListService', () => {
  let service: ProfileListService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProfileListService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
