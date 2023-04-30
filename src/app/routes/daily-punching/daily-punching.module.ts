import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';
import { DailyPunchingComponent } from './daily-punching.component';
export const routes = [
    { path: '', component: DailyPunchingComponent }
  ];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
    SharedModule],
  exports: [RouterModule],
  declarations: [
  ]
})
export class DailyPunchingModule { }