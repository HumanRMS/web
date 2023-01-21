import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrganizationLeaveComponent } from './organization-leave.component';

describe('OrganizationLeaveComponent', () => {
  let component: OrganizationLeaveComponent;
  let fixture: ComponentFixture<OrganizationLeaveComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OrganizationLeaveComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OrganizationLeaveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
