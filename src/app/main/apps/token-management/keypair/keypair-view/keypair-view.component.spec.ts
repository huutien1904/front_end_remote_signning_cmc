import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KeypairViewComponent } from './keypair-view.component';

describe('KeypairViewComponent', () => {
  let component: KeypairViewComponent;
  let fixture: ComponentFixture<KeypairViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ KeypairViewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(KeypairViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
