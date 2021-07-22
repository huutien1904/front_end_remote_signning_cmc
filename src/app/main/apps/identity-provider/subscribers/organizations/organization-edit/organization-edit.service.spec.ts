/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { OrganizationEditService } from './organization-edit.service';

describe('Service: OrganizationEdit', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [OrganizationEditService]
    });
  });

  it('should ...', inject([OrganizationEditService], (service: OrganizationEditService) => {
    expect(service).toBeTruthy();
  }));
});
