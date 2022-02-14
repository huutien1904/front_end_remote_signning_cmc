import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TokenPasswordUserComponent } from './token-password-user.component';

describe('TokenPasswordUserComponent', () => {
  let component: TokenPasswordUserComponent;
  let fixture: ComponentFixture<TokenPasswordUserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TokenPasswordUserComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TokenPasswordUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
