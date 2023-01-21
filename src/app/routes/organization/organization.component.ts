import { Component, TemplateRef, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ImageCroppedEvent } from 'ngx-image-cropper';
import { forkJoin, Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Default } from 'src/app/shared/models/default.model';
import { APIResponseStatus } from 'src/app/shared/models/Enum';
import { AlertService } from 'src/app/shared/services/alert.service';
import { OrganizationService } from './organization.service';

@Component({
  selector: 'app-organization',
  templateUrl: './organization.component.html',
  styleUrls: ['./organization.component.css']
})
export class OrganizationComponent {
  states:any[]=[];
  organization: any = {Address:{}};
  organizationId: string;
  modalRef: NgbModalRef;
  descriptionClicked:boolean;

  @ViewChild('uploadImage') uploadImage: TemplateRef<any>;

  imageChangedEvent: any = '';
  croppedImage: any = '';


  constructor(
    private organizationService: OrganizationService,
    private router: Router,
    private route: ActivatedRoute,
    private modalService: NgbModal,
    private alertService: AlertService
  ) {
    this.route.params.subscribe((s) => (this.organizationId = s['id']));
    if (
      this.organizationId != null &&
      this.organizationId != undefined &&
      this.organizationId != ''
    ) {
      this.getData();
    }else{
      this.getStates();
      this.croppedImage = Default.DefaultOrganizationImage;
    }
  }


 


  getData() {
    let success = (res: any) => {
      if(res!=null && res!=undefined)
      {
        if(res.states!=null&& res.states!=undefined)
        {
          this.states = res.states;
        }

        if(res.organization!=null&& res.organization!=undefined)
        {
          this.organization = res.organization;
        }

        if(res.organizationImage!=null&& res.organizationImage!=undefined)
        {
          if (res.organizationImage != null && res.organizationImage != undefined && res.organizationImage != 'undefined') 
          {
            this.croppedImage = res.organizationImage.Content;
          }
          else
          {
            this.croppedImage = Default.DefaultOrganizationImage;
          }
        }
        else
        {
          this.croppedImage = Default.DefaultOrganizationImage;
        }
      }
    };


    let error = (res: any) => {
      
    };
    this.callAPIS().subscribe(success, error);
  }


  callAPIS(): Observable<any> {
    const response1 = this.organizationService.getStates().pipe(catchError(error => of(error)));
    const response2 = this.organizationService.getOrganization(this.organizationId).pipe(catchError(error => of(error)));
    const response3 = this.organizationService.organizationImage(this.organizationId).pipe(catchError(error => of(error)));

    return forkJoin({ states :  response1, organization: response2, organizationImage: response3});
  }

  
  ondescriptionClick()
  {
    this.descriptionClicked = !this.descriptionClicked; 
  }

  updateDescription() {
      this.organizationService.updateorganizationDescription(this.organization).subscribe(
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


  update(form: NgForm) {
    for (var element in form.controls) {
      form.controls[element].markAsDirty();
    }

    if (form.valid) {
      this.organizationService.updateorganization(this.organization).subscribe(
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
          this.alertService.message("Something wrong happened.",'error');
        }
      );
    }
  }

  create(form: NgForm) {
    for (var element in form.controls) {
      form.controls[element].markAsDirty();
    }

    if (form.valid) {
      this.organizationService.createOrganization(this.organization).subscribe(
        (res) => {
          if(res!=null&&res!=undefined)
          {
            if(res.Status == APIResponseStatus.Success)
            {
              this.alertService.message("Data is saved.",'success');
              this.router.navigate(['/organization',res.Id]);
            }
            else
            {
              this.alertService.message("Data is not saved.",'error');
            }            
          }
        },
        (err) => 
        {
          this.alertService.message("Something wrong happen.",'error');
        }
      );
    }
  }

  getStates() {
      this.organizationService.getStates().subscribe(
        (res) => {
          this.states = res;
        },
        (err) => {}
      );
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
      "ReferenceId": this.organizationId,
      "Content": this.croppedImage
    };
    this.organizationService.uploadImage(data).subscribe(
      (res) => {
        if(res!=null && res!=undefined)
        {
          if(res.Status == APIResponseStatus.Success)
          {
            this.alertService.message('Image Uploaded successfully.', 'success');
            this.closeModal();
          }
          else
          {
            this.alertService.message('Image not saved.', 'error');
          }
        }
        else
        {
          this.alertService.message('Image not saved.', 'error');
        }
        
      },
      (err) => 
      {
        this.alertService.message('Something went wrong.', 'error');
      }
    );
  }

  cancelImage() {
    this.closeModal();
    this.imageChangedEvent = '';
    this.croppedImage = Default.DefaultOrganizationImage;
  }
}
