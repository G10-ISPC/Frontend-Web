import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { HTTP_INTERCEPTORS, HttpClientModule, provideHttpClient, withInterceptors } from '@angular/common/http';
import { injectToken } from './core/interceptors/auth-interceptor';
import { HttpErrorInterceptor } from './core/interceptors/errors-interceptor';




export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes), importProvidersFrom(HttpClientModule),
    provideHttpClient(withInterceptors([injectToken])),
    {
      provide:HTTP_INTERCEPTORS, useClass:HttpErrorInterceptor, multi: true,deps:[]
    }
  ]

};
