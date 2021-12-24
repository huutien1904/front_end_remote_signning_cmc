import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EntityProfileCreateComponent } from './entity-profile-create.component';

describe('EntityProfileCreateComponent', () => {
  let component: EntityProfileCreateComponent;
  let fixture: ComponentFixture<EntityProfileCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EntityProfileCreateComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EntityProfileCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
