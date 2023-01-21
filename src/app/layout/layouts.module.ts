import { NgModule } from '@angular/core';
import { SidebarComponent } from './sidebar/sidebar.component';
import { SharedModule } from '../shared/shared.module';
import { LoginLayoutComponent } from './login/login.component';
import { MainLayoutComponent } from './main/main.component';
import { FooterComponent } from './footer/footer.component';
import { NavbarComponent } from './navbar/navbar.component';

@NgModule({
  declarations: [
    SidebarComponent,
    NavbarComponent,
    LoginLayoutComponent,
    MainLayoutComponent,
    FooterComponent
  ],
  imports: [SharedModule],
  exports: [
    SidebarComponent,
    NavbarComponent,
    LoginLayoutComponent,
    MainLayoutComponent,
    FooterComponent
  ],
})
export class LayoutsModule {}
