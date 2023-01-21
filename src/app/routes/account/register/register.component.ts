import { HttpClient } from '@angular/common/http';
import { AfterViewInit, Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { APIResponseStatus } from 'src/app/shared/models/Enum';
import { AlertService } from 'src/app/shared/services/alert.service';
import { environment } from 'src/environments/environment';
import { AccountService } from '../account.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: [],
})
export class RegisterComponent {
  loginModel: any = {};
  confirmPasswordValidation: boolean = false;

  constructor(
    private router: Router,
    private accountService:AccountService,
    private alertService: AlertService,
    private http: HttpClient
  ) {}
  ngOnInit() {}

  comparePassword() {
    if (
      this.loginModel.Password != undefined &&
      this.loginModel.Password != null &&
      this.loginModel.Password != '' &&
      this.loginModel.ConfirmPassword != undefined &&
      this.loginModel.ConfirmPassword != null &&
      this.loginModel.ConfirmPassword != ''
    ) {
      if (this.loginModel.Password != this.loginModel.ConfirmPassword) {
        this.confirmPasswordValidation = true;
      } else this.confirmPasswordValidation = false;
    } else this.confirmPasswordValidation = false;
  }


  signUp(form: NgForm) {
    for (var element in form.controls) {
      form.controls[element].markAsDirty();
    }

    let success = (res: any) => {
      if(res.Status == APIResponseStatus.Success)
      {
        this.router.navigate(['/']);
        this.alertService.message('You got registered succesfully.', 'success');
      }
      else if(res.Status == APIResponseStatus.Conflict)
      {
        this.alertService.message('User duplicated.', 'warning');
      }
      else if(res.Status == APIResponseStatus.Failed)
      {
        this.alertService.message('User not get registered succesfully.', 'error');
      }
    };

    let error = (err: any) => {
      this.alertService.message('Somwthing went wrong.', 'error');
    };

    if (form.valid) {
      var stringifyData = JSON.stringify(this.loginModel);
      var data = JSON.parse(stringifyData);
      data.Password = btoa(data.Password);

      this.accountService.register(data).subscribe(success, error);
    }
  }

 
}
