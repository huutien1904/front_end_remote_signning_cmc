import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KeypairListComponent } from './keypair-list.component';

describe('KeypairListComponent', () => {
  let component: KeypairListComponent;
  let fixture: ComponentFixture<KeypairListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ KeypairListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(KeypairListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
