import { Component, OnInit, ViewChild, forwardRef, TemplateRef } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { CalendarOptions, Calendar, EventClickArg, DateUnselectArg } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin, {
  DateClickArg,
  EventDragStopArg,
} from '@fullcalendar/interaction';
import { FullCalendarComponent } from '@fullcalendar/angular';
import { LeavePlannerService } from './leave-planner.service';
import { AlertService } from 'src/app/shared/services/alert.service';
import { formatDate } from '@angular/common';
import { AssigneeType, LeaveEventType, LeaveStatus } from 'src/app/shared/models/Enum';
import { forkJoin, Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
@Component({
  selector: 'app-leave-planner',
  templateUrl: './leave-planner.component.html',
  styleUrls: ['./leave-planner.component.css'],
})
export class LeavePlannerComponent implements OnInit {
  isCalenderView:boolean = true;
  calendarOptions?: CalendarOptions;
  eventsModel: any;
  @ViewChild('fullcalendar') fullcalendar?: FullCalendarComponent;
  leaveEventType:any = LeaveEventType;
  leaveStatus:any = LeaveStatus;
  modalRef: NgbModalRef;
 

  constructor(private leavePlannerService :LeavePlannerService,private router:Router)
  {

  }

  ngOnInit() {
    // need for load calendar bundle first
    forwardRef(() => Calendar);

    this.calendarOptions = {
      plugins: [dayGridPlugin, interactionPlugin],
      // editable: true,  drag & drop
      headerToolbar: {
        left: 'prev,next today',
        center: 'title',
        right:''
        // right: 'myCustomButton',
      },
      // customButtons: {
      //   myCustomButton: {
      //     text: 'Card View',
      //     click: () => this.handleChangeView()
      //   }
      // },
      dateClick: this.handleDateClick.bind(this),
      eventClick: this.handleEventClick.bind(this),
      eventDragStop: this.handleEventDragStop.bind(this),
    };
    
    this.getData() ;
  }

  handleDateClick(arg: DateClickArg) 
  {
    this.leavePlannerService.setCurrentEvent({ Reviewers:[{Status : this.leaveStatus.Pending}] ,StartDate : formatDate(new Date(arg.date),"yyyy-MM-dd","en-US") ,EndDate : formatDate(new Date(arg.date),"yyyy-MM-dd","en-US") , Description:'' })
    this.router.navigate([`leave-planner/manage-leave/new`]);
  }

  handleEventClick(arg: EventClickArg) 
  {
    this.router.navigate([`leave-planner/manage-leave/${arg.event._def.extendedProps.Id}`]);
  }

  handleEventDragStop(arg: EventDragStopArg) {
    console.log(arg);
  }

  updateEvents(events:any) {

    if(events !=null && events!=undefined)
    {
      var createEvents:any[] =[]; 
      events.forEach((element:any) => {
        createEvents.push({
          title: element.Description,
          start: new Date(element.StartDate) ,
          end: new Date(element.EndDate).setDate(new Date(element.EndDate).getDate()  + 1),
          extendedProps: {
            Id: element.Id,
            StartDate : formatDate(new Date(element.StartDate),"yyyy-MM-dd","en-US"),
            EndDate : formatDate(new Date(element.EndDate),"yyyy-MM-dd","en-US"),
            EventType  : element.EventType,
            Status : element.Status
          },
        });
      });

      this.calendarOptions!.events = createEvents;
    }
  }

  getData() 
  {
    let success = (res: any) => 
    {
      if(res != null && res != undefined)
      {
        this.updateEvents(res);
      }
    };

    let error = (res: any) => {
      
    };
    this.leavePlannerService.getEvent().subscribe(success, error);
  }

}
