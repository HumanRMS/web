import { formatDate } from '@angular/common';
import { Component, OnInit, TemplateRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import * as moment from 'moment';
import { forkJoin, Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthenticationService } from 'src/app/authentication/authentication.service';
import { CalendarYvv } from 'src/app/shared/models/CalendarYvv.model';
import { APIResponseStatus, AssigneeType, DurationType, LeaveEventType, LeaveStatus } from 'src/app/shared/models/Enum';
import { AlertService } from 'src/app/shared/services/alert.service';
import { LeavePlannerService } from '../leave-planner.service';

@Component({
  selector: 'app-manage-leave',
  templateUrl: './manage-leave.component.html',
  styleUrls: ['./manage-leave.component.css']
})
export class ManageLeaveComponent implements OnInit  {
  approvalModal:any = {};
  eventModel:any = {};
  approverList:any[]=[];
  assignTypes:any[]= [ { Id:AssigneeType.Approver , Name:"Approver" },{ Id:AssigneeType.Viewer, Name:"Reviewer"}];
  leaveTypes:any[] = [{Id:LeaveEventType.Paid,Name:"Paid"},{Id:LeaveEventType.Medical,Name:"Medical"},{Id:LeaveEventType.UnPaid,Name:"UnPaid"}];
  durationTypes:any[]=[{Id:DurationType.FullDay,Name:"Full Day"},{Id:DurationType.HalfDay,Name:"Half Day"}];
  leaveStatus:any = LeaveStatus;
  modalRef: NgbModalRef;
  currentUser:any = {};
  calendar:CalendarYvv;

  leaves:any[]=[];

  constructor(private alertService:AlertService,
    private modalService: NgbModal,
    private leavePlannerService :LeavePlannerService,
    private route:ActivatedRoute,
    private router:Router,
    private authenticationService:AuthenticationService)
  {
    this.currentUser = this.authenticationService.getUser();
    this.route.params.subscribe((s) => (this.eventModel.Id = s['id']));
    if (this.eventModel.Id != null && this.eventModel.Id != undefined && this.eventModel.Id != '' && this.eventModel.Id != 'new') 
    {
      this.getData();
    }
    else
    {
      this.getEmployees();
    }
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
  }

  ngOnInit() {
    this.getAllLeaves();
  }


  getAllLeaves() 
  {
    let success = (res: any[]) => 
    {
      if(res != null && res != undefined)
      {
        res.forEach(element => 
        {
         element.StartDateTime = new Date(element.StartDate);
         element.EndDateTime = new Date(element.EndDate); 
        
          if(element.StartDateTime == element.EndDateTime)
          {
            this.leaves.push({ 
              Status : element.Status,
              Day : element.StartDateTime.getDate(),
              Month : element.StartDateTime.getMonth()+1,
              Year : element.StartDateTime.getFullYear() 
            });
          }
          else
          {
            var dates = this.getDates(element.StartDate,element.EndDateTime);
            if(dates!=null && dates!=undefined)
            {
              dates.forEach(innerElement => {
                this.leaves.push({ 
                  Status : element.Status,
                  Day : innerElement.getDate(),
                  Month : innerElement.getMonth()+1,
                  Year : innerElement.getFullYear() 
                });
              });
            }
          }

        });

        this.createCalender();
      }
    };

    let error = (res: any) => {
      
    };
    this.leavePlannerService.getEvent().subscribe(success, error);
  }

  getDates(start:string, end:Date) {
    var
      arr = new Array(),
      dt = new Date(start);
  
    while (dt <= end) {
      arr.push(new Date(dt));
      dt.setDate(dt.getDate() + 1);
    }
  
    return arr;
  
  }

  createCalender()
  {
    this.calendar = new CalendarYvv("#calendar", moment().format("Y-M-D"), "Sunday");
    var _this = this;
    this.calendar.angularPerv = function(ev:any)
    {
      ev.selectedMonth;
      ev.selectedYear;

      _this.setCalenderDates(ev.selectedMonth - 1,ev.selectedYear);
     ev.clickOnPrevMonth(ev);
    };

    this.calendar.angularNext = function(ev:any){

      _this.setCalenderDates(ev.selectedMonth + 1,ev.selectedYear);
      ev.clickOnNextMonth(ev);
     };

    var todayDate = new Date();
    var currentMonth = todayDate.getMonth()+1;
    var currentYear =  todayDate.getFullYear();
    this.setCalenderDates(currentMonth,currentYear);
    this.calendar.createCalendar();
  }

  setCalenderDates(currentMonth:number,currentYear:number)
  {
    this.calendar.pendingLeaves =  [];
    this.calendar.approvedLeaves = [];
    this.calendar.rejectedLeaves = [];
    this.calendar.cancledLeaves =  [];

    var dates:any[] = [];

    var pendingDates = this.leaves.filter(f=>f.Status == LeaveStatus.Pending && f.Month == currentMonth && f.Year == currentYear);
    if(pendingDates!=null && pendingDates!=undefined)
    {
        pendingDates.forEach(element => {
          dates.push(element.Day);
        });
        this.calendar.pendingLeaves = dates;
    }

    var approvedDates = this.leaves.filter(f=>f.Status == LeaveStatus.Approved && f.Month == currentMonth && f.Year == currentYear);
    if(approvedDates!=null && approvedDates!=undefined)
    {
        dates = [];
        approvedDates.forEach(element => {
          dates.push(element.Day);
        });
        this.calendar.approvedLeaves = dates;
    }

    var rejectedDates = this.leaves.filter(f=>f.Status == LeaveStatus.Rejected && f.Month == currentMonth && f.Year == currentYear);
    if(rejectedDates!=null && rejectedDates!=undefined)
    {
        dates = [];
        rejectedDates.forEach(element => {
          dates.push(element.Day);
        });
        this.calendar.rejectedLeaves = dates;
    }
  }


  callAPIS(): Observable<any> {
    const response1 = this.leavePlannerService.getEmployees().pipe(catchError(error => of(error)));
    const response2 = this.leavePlannerService.getLeave(this.eventModel.Id).pipe(catchError(error => of(error)));      

    return forkJoin([response1, response2]);
  }

  getEmployees() 
  {
    let success = (res: any) => 
    {
      this.eventModel = this.leavePlannerService.getCurrentEvent();
      if(res != null && res != undefined)
      {
          res.forEach((element:any) => {
            if (this.eventModel.Id == null || this.eventModel.Id == undefined || this.eventModel.Id != '' || this.eventModel.Id == 'new') 
            {
              if(this.currentUser.Email != element.Email)
              {
                this.approverList.push({Id : element.UserId , Name : element.FirstName + " "+ element.LastName +"("+ element.Mobile +")"})
              }
            }
            else
            {
              this.approverList.push({Id : element.UserId , Name : element.FirstName + " "+ element.LastName +"("+ element.Mobile +")"})
            }
          });
      }
    };

    let error = (res: any) => {
      
    };
    this.leavePlannerService.getEmployees().subscribe(success, error);
  }

  getData() 
  {
    let success = (res: any) => 
    {
      if(res != null && res != undefined)
      {
        if(res[0] != null && res[0] !=undefined)
        {
          res[0].forEach((element:any) => {
            this.approverList.push({Id : element.UserId , Name : element.FirstName + " "+ element.LastName +"("+ element.Mobile +")"})
          });
        }

        if(res[1] != null && res[1] !=undefined)
        {
          this.eventModel = res[1];
          this.eventModel.StartDate = formatDate(new Date(this.eventModel.StartDate),"yyyy-MM-dd","en-US");
          this.eventModel.EndDate = formatDate(new Date(this.eventModel.EndDate),"yyyy-MM-dd","en-US");
          this.approvalModal.Id = res[1].Id; 
        }
      }
    };

    let error = (res: any) => {
      
    };
    this.callAPIS().subscribe(success, error);
  }

  openModel(template: TemplateRef<any>) {
    this.modalRef = this.modalService.open(template, {
      backdrop: 'static',
      keyboard: false,
      size: 'md',
    });
  }

  openDeleteModel(template: TemplateRef<any>) {
    this.modalRef = this.modalService.open(template, {
      backdrop: 'static',
      keyboard: false,
      size: 'sm',
    });
  }

  closeDelteModal()
  {
    this.closeModal();
  }

  closeModal() {
    this.modalRef.close();
  }

  backToLeavePLanner()
  {
    this.router.navigate([`leave-planner`]);
  }

  create() {
    // for (var element in form.controls) {
    //   form.controls[element].markAsDirty();
    // }

    // if (form.valid) {
      this.leavePlannerService.createEvent(this.eventModel).subscribe(
        (res) => 
        {
          if(res!=null&&res!=undefined)
          {
            if(res.Status == APIResponseStatus.Success)
            {
              this.alertService.message("Data is saved.",'success');
              this.router.navigate([`leave-planner/manage-leave/${res.Id}`]);
            }
            else
            {
              this.alertService.message("Data is not saved.",'error');
            }            
          }
        },
        (err) => 
        {
          this.alertService.message("Something went wrong.",'error'); 
        }
      );
    }
  // }


  update() {
    // for (var element in form.controls) {
    //   form.controls[element].markAsDirty();
    // }

    // if (form.valid) {
      this.leavePlannerService.updateEvent(this.eventModel).subscribe(
        (res) => {
          if(res!=null&&res!=undefined)
          {
            if(res.Status == APIResponseStatus.Success)
            {
              this.alertService.message("Data is saved.",'success');
              this.getData();
            }
            else
            {
              this.alertService.message("Data is not saved.",'error');
            }            
          }
        },
        (err) => 
        {
          this.alertService.message("Something went wrong.",'error');
        }
      );
    // }
  }


  approve(status : LeaveStatus)
  {
    this.approvalModal.Status = status;
    this.approvalModal.ReferencedId = this.eventModel.Id;
    this.leavePlannerService.updateRequest(this.approvalModal).subscribe(
      (res) => 
      {
        if(res!=null&&res!=undefined)
        {
          if(res.Status == APIResponseStatus.Success)
          {
            if(status == LeaveStatus.Rejected)
            {
              this.closeModal();
            }
            this.alertService.message("Data is saved.",'success');
            this.getData();
          }
          else
          {
            this.alertService.message("Data is not saved.",'error');
          }            
        }
      },
      (err) => 
      {
        this.alertService.message("Something went wrong.",'error'); 
      }
    );
  }


  delete() {
    // for (var element in form.controls) {
    //   form.controls[element].markAsDirty();
    // }

    // if (form.valid) {
      this.leavePlannerService.deleteEvent(this.eventModel.Id).subscribe(
        (res) => {
          if(res!=null&&res!=undefined)
          {
            if(res.Status == APIResponseStatus.Success)
            {
              this.alertService.message("Data is deleted.",'success');
              this.backToLeavePLanner();
            }
            else
            {
              this.alertService.message("Data is not deleted.",'error');
            }            
          }
          this.closeModal();
        },
        (err) => 
        {
          this.alertService.message("Something went wrong.",'error');
        }
      );
    // }
  }


  addApprover()
  {
    if(this.eventModel.Reviewers ==null || this.eventModel.Reviewers ==undefined)
    {
      this.eventModel.Reviewers = [];
    }
    this.eventModel.Reviewers.push({ Status : this.leaveStatus.Pending });
  }

  deleteApprover(index:number)
  {
    if (index !== -1) 
    {
      this.eventModel.Reviewers.splice(index, 1);
    }
  }
}
