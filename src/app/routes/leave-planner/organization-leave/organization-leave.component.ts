import { formatDate } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ColumnMode, DatatableComponent } from '@swimlane/ngx-datatable';
import { APIResponseStatus } from 'src/app/shared/models/Enum';
import { AlertService } from 'src/app/shared/services/alert.service';
import { OrganizationLeaveService } from './organization-leave.service';

@Component({
  selector: 'app-organization-leave',
  templateUrl: './organization-leave.component.html',
  styleUrls: ['./organization-leave.component.css']
})
export class OrganizationLeaveComponent implements OnInit{

 leaves:any[]=[{}];
 @ViewChild(DatatableComponent) table: DatatableComponent;
  ColumnMode = ColumnMode;
  contentHeader: object;
  isExistData:boolean ;

  constructor(private organizationLeaveService: OrganizationLeaveService,private alertService:AlertService)
  {}

  ngOnInit(): void {
    this.contentHeader = {
      headerTitle: "Organization Leave",
      actionButton: true,
      breadcrumb: {
        type: "",
        links: [
          {
            name: "Home",
            isLink: true,
            link: `/dashboard`,
          },
          {
            name: "Organization Leave",
            isLink: false,
          },
        ],
      },
    };

    this.getData();
  }

  addLeave()
  {
    if(this.leaves.length < 25)
    {
      this.leaves.push({});
      this.leaves = [...this.leaves];
    }
  }

  delete(index:number)
  {
    if (index !== -1) {
        this.leaves.splice(index, 1);
        this.leaves = [...this.leaves];
    }    
  }

  getData() 
  {
    this.isExistData =false;
    let success = (res: any) => {
      if(res!=null && res!=undefined && res.length>0)
      {
        this.isExistData = true;
        res.forEach((element:any) => {
          element.StartDate = formatDate(new Date(element.StartDate),"yyyy-MM-dd","en-US"),
          element.EndDate = formatDate(new Date(element.EndDate),"yyyy-MM-dd","en-US")
        });
        this.leaves = [...res];
      }
    };

    let error = (res: any) => {
      
    };
    this.organizationLeaveService.getEvent().subscribe(success, error);
  }

  create()
  {
    this.leaves.forEach(element => {
      if(element.EndDate== null || element.EndDate==undefined || element.EndDate =='')
      {
        element.EndDate = element.StartDate;
      }
    });
    this.organizationLeaveService.createEvent(this.leaves).subscribe(
      (res) => 
      {
        if(res!=null&&res!=undefined)
        {
          if(res.Status == APIResponseStatus.Success)
          {
            this.alertService.message("Data is saved.",'success');
          }
          else
          {
            this.alertService.message("Data is not saved.",'error');
          }            
        }
        this.getData() ;
      },
      (err) => 
      {
        this.alertService.message("Something went wrong.",'error'); 
      }
    );
  }

  update()
  {
    this.leaves.forEach(element => {
      if(element.EndDate== null || element.EndDate==undefined || element.EndDate =='')
      {
        element.EndDate = element.StartDate;
      }
    });
    this.organizationLeaveService.updateEvent(this.leaves).subscribe(
      (res) => {
        if(res!=null&&res!=undefined)
        {
          if(res.Status == APIResponseStatus.Success)
          {
            this.alertService.message("Data is saved.",'success');
          }
          else
          {
            this.alertService.message("Data is not saved.",'error');
          }            
        }
        this.getData();
      },
      (err) => 
      {
        this.alertService.message("Something went wrong.",'error');
      }
    );
  }
}
