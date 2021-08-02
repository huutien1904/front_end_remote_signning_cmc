import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewPersonalSidebarComponent } from './new-personal-sidebar.component';

describe('NewPersonalSidebarComponent', () => {
  let component: NewPersonalSidebarComponent;
  let fixture: ComponentFixture<NewPersonalSidebarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewPersonalSidebarComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NewPersonalSidebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
