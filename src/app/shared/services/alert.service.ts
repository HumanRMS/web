import { Injectable } from '@angular/core';

import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root',
})
export class AlertService {
  constructor(private toastrService: ToastrService) {}
  public message(message: string, type: string) {
    switch (type) {
      case 'error':
        this.toastrService.error(message);
        break;
      case 'warning':
        this.toastrService.warning(message);
        break;
      case 'success':
        this.toastrService.success(message);
        break;
      case 'info':
        this.toastrService.info(message);
        break;
    }
  }
}
