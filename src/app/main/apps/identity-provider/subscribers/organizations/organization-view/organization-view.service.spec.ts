/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { OrganizationViewService } from './organization-view.service';

describe('Service: OrganizationView', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [OrganizationViewService]
    });
  });

  it('should ...', inject([OrganizationViewService], (service: OrganizationViewService) => {
    expect(service).toBeTruthy();
  }));
});
