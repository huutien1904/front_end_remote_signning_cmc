import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TokenViewDetailComponent } from './token-view-detail.component';

describe('TokenViewDetailComponent', () => {
  let component: TokenViewDetailComponent;
  let fixture: ComponentFixture<TokenViewDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TokenViewDetailComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TokenViewDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
