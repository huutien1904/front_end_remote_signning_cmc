import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PersonalListCreateComponent } from './personal-list-create.component';

describe('PersonalListCreateComponent', () => {
  let component: PersonalListCreateComponent;
  let fixture: ComponentFixture<PersonalListCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PersonalListCreateComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PersonalListCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
