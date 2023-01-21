import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LeavePlannerCardViewComponent } from './leave-planner-card-view.component';

describe('LeavePlannerCardViewComponent', () => {
  let component: LeavePlannerCardViewComponent;
  let fixture: ComponentFixture<LeavePlannerCardViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LeavePlannerCardViewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LeavePlannerCardViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
