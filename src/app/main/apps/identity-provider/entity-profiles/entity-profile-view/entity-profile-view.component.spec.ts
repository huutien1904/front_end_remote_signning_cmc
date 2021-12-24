import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EntityProfileViewComponent } from './entity-profile-view.component';

describe('EntityProfileViewComponent', () => {
  let component: EntityProfileViewComponent;
  let fixture: ComponentFixture<EntityProfileViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EntityProfileViewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EntityProfileViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
