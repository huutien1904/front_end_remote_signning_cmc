/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { TokenEditComponent } from './token-edit.component';

describe('TokenEditComponent', () => {
  let component: TokenEditComponent;
  let fixture: ComponentFixture<TokenEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TokenEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TokenEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
