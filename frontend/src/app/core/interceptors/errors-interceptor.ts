import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, catchError, throwError } from "rxjs";
import { LogService } from "../../core/services/log.service";

@Injectable()
export class HttpErrorInterceptor implements HttpInterceptor{
    constructor(private logService: LogService){}
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(req).pipe(
            catchError((error:HttpErrorResponse)=>{
                //if (true){this.logService.logout()}
                console.log(error)
                return throwError(error)
            }         
            )
        )
    }
}
