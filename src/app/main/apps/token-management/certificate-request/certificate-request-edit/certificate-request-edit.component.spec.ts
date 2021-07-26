import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CertificateRequestEditComponent } from './certificate-request-edit.component';

describe('CertificateRequestEditComponent', () => {
  let component: CertificateRequestEditComponent;
  let fixture: ComponentFixture<CertificateRequestEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CertificateRequestEditComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CertificateRequestEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
