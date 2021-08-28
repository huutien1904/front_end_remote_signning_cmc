import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewHsmComponent } from './new-hsm.component';

describe('NewHsmComponent', () => {
  let component: NewHsmComponent;
  let fixture: ComponentFixture<NewHsmComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewHsmComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NewHsmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
