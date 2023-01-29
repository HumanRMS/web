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
  user:any={};
  notifications:any[]=[];

  constructor(private navbarService:NavbarService,private notificationService:NotificationService,private translate: TranslateService,private authenticationService:AuthenticationService) { this.selectedLanguage = this.translate.currentLang;}

  ngOnInit(): void {
    this.getProfile();
    this.getNotification();
  }
  
  changeLanguage(lan:any) {
    this.translate.use(lan);
  }

  getProfile() {
    this.navbarService.getProfile().subscribe(
      (res) => {
        var sessionUser = this.authenticationService.getUser();
        if(sessionUser!=null && sessionUser!=undefined)
        {
          sessionUser.Email = res.ReturnObject.Email;
          sessionUser.Name = res.ReturnObject.Name;
          this.authenticationService.setUser(sessionUser);          
        }
        this.user = res.ReturnObject;
      },
      (err) => {}
    );
}

getNotification() {
  this.navbarService.getNotification().subscribe(
    (res) => {
      this.notifications = res;
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
    var Ids:any[] = [];
    this.notifications.forEach(element => {
      Ids.push(element.Id);
    });
    this.notificationService.updateNotification(Ids).subscribe( (res) => 
    {
    },
    (err) => {});
  }
}
