/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { PersonalViewService } from './personal-view.service';

describe('Service: PersonalView', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PersonalViewService]
    });
  });

  it('should ...', inject([PersonalViewService], (service: PersonalViewService) => {
    expect(service).toBeTruthy();
  }));
});
