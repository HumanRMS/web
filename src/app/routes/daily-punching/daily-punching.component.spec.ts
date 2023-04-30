import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DailyPunchingComponent } from './daily-punching.component';

describe('DailyPunchingComponent', () => {
  let component: DailyPunchingComponent;
  let fixture: ComponentFixture<DailyPunchingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DailyPunchingComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DailyPunchingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
