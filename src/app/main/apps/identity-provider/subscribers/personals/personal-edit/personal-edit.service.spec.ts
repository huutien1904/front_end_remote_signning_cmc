/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { PersonalEditService } from './personal-edit.service';

describe('Service: PersonalEdit', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PersonalEditService]
    });
  });

  it('should ...', inject([PersonalEditService], (service: PersonalEditService) => {
    expect(service).toBeTruthy();
  }));
});
