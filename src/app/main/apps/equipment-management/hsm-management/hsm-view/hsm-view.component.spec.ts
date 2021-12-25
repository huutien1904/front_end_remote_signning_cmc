/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { HsmViewComponent } from './hsm-view.component';

describe('HsmViewComponent', () => {
  let component: HsmViewComponent;
  let fixture: ComponentFixture<HsmViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HsmViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HsmViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
