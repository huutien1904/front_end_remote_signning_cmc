/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { HsmListComponent } from './hsm-list.component';

describe('HsmListComponent', () => {
  let component: HsmListComponent;
  let fixture: ComponentFixture<HsmListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HsmListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HsmListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
