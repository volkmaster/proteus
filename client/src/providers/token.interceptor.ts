import { Injectable } from '@angular/core';
import { HttpRequest, HttpEvent, HttpHandler, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

// Services
import { AuthService } from './auth.service';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {

    constructor(public authService: AuthService) { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        request = request.clone({
            setHeaders: { Authorization: this.authService.getAuthorizationHeaderValue() }
        });

        return next.handle(request);
    }

}
