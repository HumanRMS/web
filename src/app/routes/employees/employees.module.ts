import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { SharedModule } from 'src/app/shared/shared.module';
import { EmployeesComponent } from './employees.component';
import { ManageEmployeeComponent } from './manage-employee/manage-employee.component';
import { ImageCropperModule } from 'ngx-image-cropper';
export const routes = [
    { path: '', component: EmployeesComponent },
    { path: 'manage-employee', component: ManageEmployeeComponent },
    { path: 'manage-employee/:id', component: ManageEmployeeComponent }
  ];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
    NgxDatatableModule,
    ImageCropperModule,
    SharedModule],
  exports: [RouterModule],
  declarations: [
    EmployeesComponent,
    ManageEmployeeComponent
  ]
})
export class EmployeesModule { }