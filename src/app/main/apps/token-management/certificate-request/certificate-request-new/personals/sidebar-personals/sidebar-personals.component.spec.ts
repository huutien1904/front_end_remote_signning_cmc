import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SidebarPersonalsComponent } from './sidebar-personals.component';

describe('SidebarPersonalsComponent', () => {
  let component: SidebarPersonalsComponent;
  let fixture: ComponentFixture<SidebarPersonalsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SidebarPersonalsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SidebarPersonalsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
