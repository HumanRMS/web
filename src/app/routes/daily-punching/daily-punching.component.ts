import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-daily-punching',
  templateUrl: './daily-punching.component.html',
  styleUrls: ['./daily-punching.component.css']
})
export class DailyPunchingComponent implements OnInit{
  currentLocation:any;
  lat:any;
  lng:any;
  ngOnInit(): void {
    throw new Error('Method not implemented.');
  }

  

}
