import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MonitorlogComponent } from './monitorlog.component';

describe('MonitorlogComponent', () => {
  let component: MonitorlogComponent;
  let fixture: ComponentFixture<MonitorlogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MonitorlogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MonitorlogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
