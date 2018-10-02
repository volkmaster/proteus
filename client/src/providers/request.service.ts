import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

// Services
//import { AuthService } from './auth.service';
import { EnvironmentService } from './environment.service';
import { HttpService } from './http.service';
import { ToastService } from './toast.service';

@Injectable()
export class RequestService {

    constructor(
        //private authService: AuthService,
        private environmentService: EnvironmentService,
        private httpService: HttpService,
        private toastService: ToastService
    ) { }

    public post(url: string, body: any, { apiUrl = '', headers = { }, params = { }, requestType = 'json', responseType = 'json' }: { apiUrl?: string, headers?: { [key: string]: any }, params?: { [key: string]: any }, requestType?: string, responseType?: string } = { }): Observable<any> {
        return this.httpService.post(this.constructAddress(apiUrl, url), body, this.appendAuthorizationHeader(headers), params, requestType, responseType)
            .catch(this.handleError(url));
    }

    public get(url: string, { apiUrl = '', headers = { }, params = { }, responseType = 'json' }: { apiUrl?: string, headers?: { [key: string]: any }, params?: { [key: string]: any }, responseType?: string } = { }): Observable<any> {
        return this.httpService.get(this.constructAddress(apiUrl, url), this.appendAuthorizationHeader(headers), params, responseType)
            .catch(this.handleError(url));
    }

    public put(url: string, body: any, { apiUrl = '', headers = { }, params = { }, requestType = 'json' }: { apiUrl?: string, headers?: { [key: string]: any }, params?: { [key: string]: any }, requestType?: string } = { }): Observable<any> {
        return this.httpService.put(this.constructAddress(apiUrl, url), body, this.appendAuthorizationHeader(headers), params, requestType)
            .catch(this.handleError(url));
    }

    public patch(url: string, body: string, { apiUrl = '', headers = { }, params = { }, requestType = 'json' }: { apiUrl?: string, headers?: { [key: string]: any }, params?: { [key: string]: any }, requestType?: string } = { }): Observable<any> {
        return this.httpService.patch(this.constructAddress(apiUrl, url), body, this.appendAuthorizationHeader(headers), params, requestType)
            .catch(this.handleError(url));
    }

    public delete(url: string, { apiUrl = '', headers = { }, params = { } }: { apiUrl?: string, headers?: { [key: string]: any }, params?: { [key: string]: any } } = { }): Observable<any> {
        return this.httpService.delete(this.constructAddress(apiUrl, url), this.appendAuthorizationHeader(headers), params)
            .catch(this.handleError(url));
    }

    private constructAddress(apiUrl?: string, url?: string): string {
        return apiUrl || this.environmentService.get('apiUrl') + url;
    }

    private appendAuthorizationHeader(headers: { [key: string]: any }): { [key: string]: any } {
        //headers['Authorization'] = this.authService.getAuthorizationHeaderValue();

        return headers;
    }

    private handleError<T> (url: string, result?: T) {
        return (error: any): Observable<T> => {
            console.error(`${url} failed: ${error.message}`);
            this.toastService.show(error.message, 2000, 'top');
            return Observable.of(result as T);
        };
    }

}
