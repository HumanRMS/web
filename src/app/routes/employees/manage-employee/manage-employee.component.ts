import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { EmployeesService } from '../employees.service';
import { ImageCroppedEvent, LoadedImage } from 'ngx-image-cropper';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { AlertService } from 'src/app/shared/services/alert.service';
import { forkJoin, Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Default } from 'src/app/shared/models/default.model';
import { APIResponseStatus } from 'src/app/shared/models/Enum';
@Component({
  selector: 'app-manage-employee',
  templateUrl: './manage-employee.component.html',
  styleUrls: ['./manage-employee.component.css'],
})
export class ManageEmployeeComponent implements OnInit {
  employee: any = {};
  employeeId: string;
  modalRef: NgbModalRef;
  descriptionClicked:boolean;

  @ViewChild('uploadImage') uploadImage: TemplateRef<any>;

  imageChangedEvent: any = '';
  croppedImage: any = '';

  // Dynamic Data
  genders: any[] = [
    { text: 'Male', value: 'Male' },
    { text: 'Female', value: 'Female' },
    { text: 'Others', value: 'Others' },
  ];

  constructor(
    private employeesService: EmployeesService,
    private router: Router,
    private route: ActivatedRoute,
    private modalService: NgbModal,
    private alertService: AlertService
  ) {
    this.route.params.subscribe((s) => (this.employeeId = s['id']));
    if (
      this.employeeId != null &&
      this.employeeId != undefined &&
      this.employeeId != '' &&
      this.employeeId != 'new' 
    ) 
    {
      this.getData();
    }else
    {
      this.croppedImage = Default.DefaultEmployeeImage; 
    }
  }

  callAPIS(): Observable<any> {
    const response1 = this.employeesService.getEmployee(this.employeeId).pipe(catchError(error => of(error)));
    const response2 = this.employeesService.getEmployeeImage(this.employeeId).pipe(catchError(error => of(error)));

    return forkJoin({  employee: response1, employeeImage: response2});
  }


  getData() {
    let success = (res: any) => {
      if(res!=null && res!=undefined)
      {
        if(res.employee!=null&& res.employee!=undefined)
        {
          this.employee = res.employee;
        }

        if(res.employeeImage!=null&& res.employeeImage!=undefined)
        {
          if (res.employeeImage != null && res.employeeImage != undefined && res.employeeImage != 'undefined') 
          {
            this.croppedImage = res.employeeImage.Content;
          }
          else
          {
            this.croppedImage = Default.DefaultEmployeeImage;
          }
        }
        else
        {
          this.croppedImage = Default.DefaultEmployeeImage;
        }
      }
    };

    let error = (res: any) => {
      
    };
    this.callAPIS().subscribe(success, error);
  }


  update(form: NgForm) {
    for (var element in form.controls) {
      form.controls[element].markAsDirty();
    }

    if (form.valid) {
      this.employeesService.updateEmployee(this.employee).subscribe(
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
        },
        (err) => 
        {
          this.alertService.message("Something went wrong.",'error');
        }
      );
    }
  }

  create(form: NgForm) {
    for (var element in form.controls) {
      form.controls[element].markAsDirty();
    }

    if (form.valid) {
      this.employeesService.createEmployee(this.employee).subscribe(
        (res) => 
        {
          if(res!=null&&res!=undefined)
          {
            if(res.Status == APIResponseStatus.Success)
            {
              this.alertService.message("Data is saved.",'success');
              this.router.navigate(['employees']);
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
  }
  openModel(template: TemplateRef<any>) {
    this.modalRef = this.modalService.open(template, {
      backdrop: 'static',
      keyboard: false,
      size: 'sm',
    });
  }

  closeModal() {
    this.modalRef.close();
  }
  ngOnInit(): void {}

  fileChangeEvent(event: any): void {
    // this.imageChangedEvent = event;

    if (event.target.files && event.target.files[0]) {
      if (
        event.target.files[0].type === 'image/jpeg' ||
        event.target.files[0].type === 'image/png' ||
        event.target.files[0].type === 'image/jpg'
      ) {
        if (event.target.files[0].size < 200 * 200) {
          /* Checking height * width*/
        }
        if (event.target.files[0].size < 2000000) {
          this.imageChangedEvent = event;
        } else {
          this.alertService.message(
            "Can't upload file greater than 2 MB.",
            'warning'
          );
          return;
        }
      }
    }

    this.openModel(this.uploadImage);
  }
  imageCropped(event: ImageCroppedEvent) {
    this.croppedImage = event.base64;
  }

  saveImage() {
    var data = {
      "ReferenceId": this.employeeId,
      "Content": this.croppedImage
    };
    this.employeesService.uploadImage(data).subscribe(
      (res) => {
        this.alertService.message('Image Uploaded successfully.', 'success');
        this.closeModal();
      },
      (err) => {
        this.alertService.message('Image not Uploaded successfully.', 'error');
      }
    );
  }

  cancelImage() {
    this.closeModal();
    this.imageChangedEvent = '';
    this.croppedImage = Default.DefaultEmployeeImage
  }

  ondescriptionClick()
  {
    this.descriptionClicked = !this.descriptionClicked; 
  }

  updateDescription() {
      this.employeesService.updateEmployeeDescription(this.employee).subscribe(
        (res) => {
          if(res!=null&&res!=undefined)
          {
            if(res.Status == APIResponseStatus.Success)
            {
              this.alertService.message("Data is saved.",'success');
              let currentUrl = this.router.url;
              this.router.navigateByUrl('/', {skipLocationChange: true}).then(() => {
                  this.router.navigate([currentUrl]);
              });
            }
            else
            {
              this.alertService.message("Data is not saved.",'error');
            }            
          }
        },
        (err) => 
        {
          this.alertService.message("Something wrong happened.",'error');
        }
      );
  }
}
