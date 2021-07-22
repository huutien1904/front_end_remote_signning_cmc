/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { PersonalListService } from './personal-list.service';

describe('Service: PersonalList', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PersonalListService]
    });
  });

  it('should ...', inject([PersonalListService], (service: PersonalListService) => {
    expect(service).toBeTruthy();
  }));
});
