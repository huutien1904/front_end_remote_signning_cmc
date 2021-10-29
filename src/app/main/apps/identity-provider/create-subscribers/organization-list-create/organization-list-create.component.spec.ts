import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrganizationListCreateComponent } from './organization-list-create.component';

describe('OrganizationListCreateComponent', () => {
  let component: OrganizationListCreateComponent;
  let fixture: ComponentFixture<OrganizationListCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OrganizationListCreateComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OrganizationListCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
