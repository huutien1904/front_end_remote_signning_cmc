import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewOrganizationSidebarComponent } from './new-organization-sidebar.component';

describe('NewOrganizationSidebarComponent', () => {
  let component: NewOrganizationSidebarComponent;
  let fixture: ComponentFixture<NewOrganizationSidebarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewOrganizationSidebarComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NewOrganizationSidebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
