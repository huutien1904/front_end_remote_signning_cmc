import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CertificateRequestNewComponent } from './certificate-request-new.component';

describe('CertificateRequestNewComponent', () => {
  let component: CertificateRequestNewComponent;
  let fixture: ComponentFixture<CertificateRequestNewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CertificateRequestNewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CertificateRequestNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
