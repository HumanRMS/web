import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { SharedModule } from 'src/app/shared/shared.module';
import { ImageCropperModule } from 'ngx-image-cropper';
import { ProjectsComponent } from './projects.component';
export const routes = [
    { path: '', component: ProjectsComponent }
  ];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
    NgxDatatableModule,
    ImageCropperModule,
    SharedModule],
  exports: [RouterModule],
  declarations: [ProjectsComponent]
})
export class ProjectsModule { }