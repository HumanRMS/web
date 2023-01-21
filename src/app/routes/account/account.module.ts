import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';

const routes: Routes = [
    { path: "", component: LoginComponent },
    { path: "sign-up", component: RegisterComponent },
    { path: "forgot-password", component: ForgotPasswordComponent },
  ];

@NgModule({
  declarations: [
    LoginComponent, 
    RegisterComponent, 
    ForgotPasswordComponent
  ],
  imports: [SharedModule, RouterModule.forChild(routes)],
  providers:[]
})
export class AccountModule {}
