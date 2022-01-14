import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CertificateRequestListComponent } from './certificate-request-list.component';

describe('CertificateRequestListComponent', () => {
  let component: CertificateRequestListComponent;
  let fixture: ComponentFixture<CertificateRequestListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CertificateRequestListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CertificateRequestListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
