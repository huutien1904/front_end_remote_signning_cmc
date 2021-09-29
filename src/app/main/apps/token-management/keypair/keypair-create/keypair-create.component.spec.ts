import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KeypairCreateComponent } from './keypair-create.component';

describe('KeypairCreateComponent', () => {
  let component: KeypairCreateComponent;
  let fixture: ComponentFixture<KeypairCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ KeypairCreateComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(KeypairCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
