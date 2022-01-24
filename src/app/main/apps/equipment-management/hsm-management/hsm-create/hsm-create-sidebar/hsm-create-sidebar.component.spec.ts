import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HsmCreateSidebarComponent } from './hsm-create-sidebar.component';

describe('HsmCreateSidebarComponent', () => {
  let component: HsmCreateSidebarComponent;
  let fixture: ComponentFixture<HsmCreateSidebarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HsmCreateSidebarComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HsmCreateSidebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
