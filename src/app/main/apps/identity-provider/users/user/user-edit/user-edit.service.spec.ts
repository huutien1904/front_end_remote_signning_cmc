/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { UserEditService } from './user-edit.service';

describe('Service: UserEdit', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [UserEditService]
    });
  });

  it('should ...', inject([UserEditService], (service: UserEditService) => {
    expect(service).toBeTruthy();
  }));
});
