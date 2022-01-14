import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubscriberCertificateListComponent } from './subscriber-certificate-list.component';

describe('SubscriberCertificateListComponent', () => {
  let component: SubscriberCertificateListComponent;
  let fixture: ComponentFixture<SubscriberCertificateListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SubscriberCertificateListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SubscriberCertificateListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
