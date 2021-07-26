import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CertificateRequestViewComponent } from './certificate-request-view.component';

describe('CertificateRequestViewComponent', () => {
  let component: CertificateRequestViewComponent;
  let fixture: ComponentFixture<CertificateRequestViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CertificateRequestViewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CertificateRequestViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
