import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KeypairEditComponent } from './keypair-edit.component';

describe('KeypairEditComponent', () => {
  let component: KeypairEditComponent;
  let fixture: ComponentFixture<KeypairEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ KeypairEditComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(KeypairEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
