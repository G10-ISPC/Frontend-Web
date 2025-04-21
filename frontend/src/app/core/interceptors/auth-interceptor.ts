import { HttpInterceptorFn } from "@angular/common/http";
import { inject } from "@angular/core";
import { LogService } from "../../core/services/log.service";

export const injectToken: HttpInterceptorFn = (req, next) => {
    const loginService = inject(LogService);
    const token = loginService.getToken();
    console.log(`Token: ${token}`);  
    if (token) {
        const modifiedRequest = req.clone({
            setHeaders: {
                Authorization: `Bearer ${token}`
            }
        });
        console.log(modifiedRequest);  
        return next(modifiedRequest);
    } else {
        return next(req);  
    }
};

