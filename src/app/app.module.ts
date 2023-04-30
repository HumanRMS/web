import { HttpClient, HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { isDevMode, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';

import { AppComponent } from './app.component';
import {
  AuthenticationService,
  AUTH_PROVIDERS,
} from './authentication/authentication.service';
import { LoggedInGuard } from './authentication/logged-in.guard';
import { LayoutsModule } from './layout/layouts.module';
import { AppRoutingModule } from './routes/routes.module';
import { SharedModule } from './shared/shared.module';
import {
  NgxUiLoaderModule,
  NgxUiLoaderConfig,
  NgxUiLoaderRouterModule,
  NgxUiLoaderHttpModule,
} from 'ngx-ui-loader';

import {TranslateModule, TranslateLoader} from '@ngx-translate/core';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';
import { RequestInterceptor } from './shared/services/http.interceptor';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { ToastrModule } from 'ngx-toastr';
import { ServiceWorkerModule } from '@angular/service-worker';

// AoT requires an exported function for factories
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}

const ngxUiLoaderConfig: NgxUiLoaderConfig = {
  bgsSize: 40,
  fgsColor: '#7367f0',
  pbColor: '#7367f0',
  pbThickness: 5, // progress bar thickness
};

@NgModule({
  declarations: [AppComponent],
  imports: [
  
    BrowserModule,
    AppRoutingModule,
    SharedModule,
    HttpClientModule,
    NgxUiLoaderModule.forRoot(ngxUiLoaderConfig),
    NgxUiLoaderRouterModule, // import this module for showing loader automatically when navigating between app routes
    NgxUiLoaderHttpModule.forRoot({
      showForeground: true,
      exclude: [
        '/api/dontWatch$'
      ]
    }),
    TranslateModule.forRoot({
      loader: {
          provide: TranslateLoader,
          useFactory: HttpLoaderFactory,
          deps: [HttpClient]
      },
  }),  
  BrowserAnimationsModule, // required animations module
  ToastrModule.forRoot({
    maxOpened: 1,
    timeOut: 10000,
    positionClass: 'toast-top-right',
    preventDuplicates: true,
  }),
  ServiceWorkerModule.register('ngsw-worker.js', {
    enabled: !isDevMode(),
    // Register the ServiceWorker as soon as the application is stable
    // or after 30 seconds (whichever comes first).
    registrationStrategy: 'registerWhenStable:30000'
  })
  ],
  providers: [ 
    AUTH_PROVIDERS,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: RequestInterceptor,
      multi: true,
  },
    LoggedInGuard],
  bootstrap: [AppComponent],
})
export class AppModule {}
