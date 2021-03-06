/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { TokenViewComponent } from './token-view.component';

describe('TokenViewComponent', () => {
  let component: TokenViewComponent;
  let fixture: ComponentFixture<TokenViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TokenViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TokenViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
