import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NotificationsComponent } from './notifications.component';
export const routes = [
    { path: '', component: NotificationsComponent }
  ];

@NgModule({
  imports: [
    RouterModule.forChild(routes)],
  exports: [RouterModule],
  declarations: [NotificationsComponent]
})
export class NotificationsModule { }