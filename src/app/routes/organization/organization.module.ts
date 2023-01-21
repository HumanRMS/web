import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { SharedModule } from 'src/app/shared/shared.module';
import { ImageCropperModule } from 'ngx-image-cropper';
import { OrganizationComponent } from './organization.component';
export const routes = [
    { path: '', component: OrganizationComponent },
    { path: ':id', component: OrganizationComponent }
  ];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
    NgxDatatableModule,
    ImageCropperModule,
    SharedModule],
  exports: [RouterModule],
  declarations: [OrganizationComponent]
})
export class organizationModule { }