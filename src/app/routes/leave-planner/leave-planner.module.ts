import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';
import { FullCalendarModule } from '@fullcalendar/angular';
import { LeavePlannerComponent } from './leave-planner.component';
import { OrganizationLeaveComponent } from './organization-leave/organization-leave.component';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { ManageLeaveComponent } from './manage-leave/manage-leave.component';

export const routes = [
    { path: '', component: LeavePlannerComponent },
    { path: 'manage-leave/:id', component: ManageLeaveComponent },
    { path: 'organization-leave', component: OrganizationLeaveComponent }
  ];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
    FullCalendarModule,
    NgxDatatableModule,
    SharedModule],
  exports: [RouterModule],
  declarations: [LeavePlannerComponent, OrganizationLeaveComponent, ManageLeaveComponent]
})
export class LeavePlannerModule { }