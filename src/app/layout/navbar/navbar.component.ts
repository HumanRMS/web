import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { AuthenticationService } from 'src/app/authentication/authentication.service';
import { NotificationService } from 'src/app/routes/notifications/notifications.service';
import { NavbarService } from './navbar.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  selectedLanguage:string;
  user:any = {};
  notifications:any[] = [];

  constructor(private navbarService:NavbarService,private notificationService:NotificationService,private translate: TranslateService,private authenticationService:AuthenticationService) { this.selectedLanguage = this.translate.currentLang;}

  ngOnInit(): void {
    this.getProfile();
  }
  
  changeLanguage(lan:any) {
    this.translate.use(lan);
  }

  getProfile() {
    this.navbarService.getData().subscribe(
      (res:any) =>
       {
          if(res.ReturnObject!=null && res.ReturnObject!=undefined)
          {
            var sessionUser = this.authenticationService.getUser();
            if(sessionUser!=null && sessionUser!=undefined)
            {
              sessionUser.Email = res.ReturnObject.Email;
              sessionUser.UserName = res.ReturnObject.UserName;
              this.authenticationService.setUser(sessionUser);          
            }
            this.user = res.ReturnObject;
          }
      },
      (err) => {}
    );
}
  
  logout()
  {
    this.authenticationService.logout();
  }

  updateNotification()
  {
    this.notificationService.getNotification().subscribe( (res) => 
    {
      this.user.NotificationCount = 0;
      this.notifications = res;
    },
    (err) => {});
  }
}
