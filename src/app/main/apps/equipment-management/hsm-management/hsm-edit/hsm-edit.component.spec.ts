/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { HsmEditComponent } from './hsm-edit.component';

describe('HsmEditComponent', () => {
  let component: HsmEditComponent;
  let fixture: ComponentFixture<HsmEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HsmEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HsmEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
