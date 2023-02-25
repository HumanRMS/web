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
    this.createCalender();
  }

  createCalender()
  {
    var calendar = new CalendarYvv("#calendar", moment().format("Y-M-D"), "Sunday");
    calendar.funcPer = function(ev:any){
      console.log(ev)
    };
    calendar.pendingLeaves = [4,11,18,28];
    calendar.approvedLeaves = [5,10];
    calendar.rejectedLeaves = [25,26];
    calendar.cancledLeaves = [22,7];

    calendar.createCalendar();
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
