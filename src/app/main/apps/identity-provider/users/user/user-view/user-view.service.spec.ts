/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { UserViewService } from './user-view.service';

describe('Service: UserView', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [UserViewService]
    });
  });

  it('should ...', inject([UserViewService], (service: UserViewService) => {
    expect(service).toBeTruthy();
  }));
});
