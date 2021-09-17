import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubscriberCertificateNewComponent } from './subscriber-certificate-new.component';

describe('SubscriberCertificateNewComponent', () => {
  let component: SubscriberCertificateNewComponent;
  let fixture: ComponentFixture<SubscriberCertificateNewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SubscriberCertificateNewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SubscriberCertificateNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
