import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateCertificateRequestListComponent } from './create-certificate-request-list.component';

describe('CreateCertificateRequestListComponent', () => {
  let component: CreateCertificateRequestListComponent;
  let fixture: ComponentFixture<CreateCertificateRequestListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateCertificateRequestListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateCertificateRequestListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
