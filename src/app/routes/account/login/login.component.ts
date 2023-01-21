import { Component, AfterViewInit } from '@angular/core';
import { AuthenticationService } from '../../../authentication/authentication.service';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { AlertService } from '../../../shared/services/alert.service';
import { NgForm } from '@angular/forms';
import { environment } from 'src/environments/environment';
import { TranslateService } from '@ngx-translate/core';
import { AccountService } from '../account.service';
import { APIResponseStatus } from 'src/app/shared/models/Enum';

declare var $: any;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: [],
})
export class LoginComponent {
  model: any = {};
  rememberMe: boolean = true;
  constructor(
    private authenticationService: AuthenticationService,
    private http: HttpClient,
    private accountService:AccountService,
    private router: Router,
    private alertService: AlertService,
    private translateService: TranslateService
  ) {
    this.getCredntials();
  }
  ngOnInit() {
    // this.alertService.message('sgfdgdf','success');
  }

  setCredntials() {
    var str = btoa(
      JSON.stringify({
        UserName: this.model.UserName,
        Password: this.model.Password,
      })
    );
    localStorage.setItem('HRMSloginUser', str);
  }

  getCredntials() {
    var str = localStorage.getItem('HRMSloginUser');
    this.rememberMe = true;
    if (str != undefined && str != null && str != '') {
      this.rememberMe = true;
      var user = JSON.parse(atob(str));
      this.model.UserName = user.UserName;
      this.model.Password = user.Password;
    } else this.rememberMe = false;
  }

  removeCredentials() {
    var str = localStorage.getItem('HRMSloginUser');
    if (str != undefined && str != null && str != '') {
      localStorage.removeItem('HRMSloginUser');
    }
  }

  signIn(form: NgForm) {
    for (var element in form.controls) {
      form.controls[element].markAsDirty();
    }

    if (form.valid) {
      if (this.rememberMe) this.setCredntials();
      else this.removeCredentials();
      var stringifyData = JSON.stringify(this.model);
      var data = JSON.parse(stringifyData);
      data.Password = btoa(data.Password);
      this.accountService.login(data).subscribe(
          (res: any) => 
          {
            if(res.Status == APIResponseStatus.Success)
            {
              this.authenticationService.setUser(res.ReturnObject);
              this.router.navigate(['/dashboard']);
              this.alertService.message('User logged in succesfully.', 'success');
            }
            else if(res.Status == APIResponseStatus.Failed)
            {
              this.alertService.message('User not registered', 'error');
            }
          },
          (err: any) => {
             this.alertService.message('Something get wrong.', 'error');
          }
        );
    }
  }
}
