import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { NgSelectModule } from '@ng-select/ng-select';
@NgModule({
  declarations: [],
  imports: [
    RouterModule,
    CommonModule,
    NgSelectModule,
    FormsModule,
    HttpClientModule,
    TranslateModule,
  ],
  exports: [
    RouterModule,
    CommonModule,
    FormsModule,
    HttpClientModule,
    TranslateModule,
    NgSelectModule
  ],
})
export class SharedModule {}
