import { Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/catch';

// Services
import { EnvironmentService } from './environment.service';
import { HttpService } from './http.service';
import { ToastService } from './toast.service';

@Injectable()
export class RequestService {

    constructor(
        private environmentService: EnvironmentService,
        private httpService: HttpService,
        private toastService: ToastService
    ) { }

    public post(url: string, body: any, { apiUrl = '', headers = { }, params = { }, requestType = 'json', responseType = 'json' }: { apiUrl?: string, headers?: { [key: string]: any }, params?: { [key: string]: any }, requestType?: string, responseType?: string } = { }): Observable<any> {
        return this.httpService.post(this.constructAddress(apiUrl, url), body, headers, params, requestType, responseType)
            .catch(this.handleError(url));
    }

    public get(url: string, { apiUrl = '', headers = { }, params = { }, responseType = 'json' }: { apiUrl?: string, headers?: { [key: string]: any }, params?: { [key: string]: any }, responseType?: string } = { }): Observable<any> {
        return this.httpService.get(this.constructAddress(apiUrl, url), headers, params, responseType)
            .catch(this.handleError(url));
    }

    public put(url: string, body: any, { apiUrl = '', headers = { }, params = { }, requestType = 'json' }: { apiUrl?: string, headers?: { [key: string]: any }, params?: { [key: string]: any }, requestType?: string } = { }): Observable<any> {
        return this.httpService.put(this.constructAddress(apiUrl, url), body, headers, params, requestType)
            .catch(this.handleError(url));
    }

    public patch(url: string, body: string, { apiUrl = '', headers = { }, params = { }, requestType = 'json' }: { apiUrl?: string, headers?: { [key: string]: any }, params?: { [key: string]: any }, requestType?: string } = { }): Observable<any> {
        return this.httpService.patch(this.constructAddress(apiUrl, url), body, headers, params, requestType)
            .catch(this.handleError(url));
    }

    public delete(url: string, { apiUrl = '', headers = { }, params = { } }: { apiUrl?: string, headers?: { [key: string]: any }, params?: { [key: string]: any } } = { }): Observable<any> {
        return this.httpService.delete(this.constructAddress(apiUrl, url), headers, params)
            .catch(this.handleError(url));
    }

    private constructAddress(apiUrl?: string, url?: string): string {
        return apiUrl || this.environmentService.get('apiUrl') + url;
    }

    private handleError(url: string) {
        return (error: any): Observable<any> => {
            let message = '';

            if (error.error instanceof ErrorEvent) {
                message = error.error.message;
            } else if (error instanceof HttpErrorResponse) {
                switch (error.status) {
                    case 0:
                        message = 'Server is inaccessible. Contact the support.';
                        this.toastService.show(message, 2000, 'top');
                        break;
                    case 401:
                        if (url !== '/auth/verify') {
                            message = 'Session has expired. Log in.';
                            this.toastService.show(message, 2000, 'top');
                        } else {
                            message = error.error;
                        }
                    default:
                        message = error.error;
                        break;
                }
            }

            console.error(`Request to ${url} failed: ${message}`);

            return Observable.throw(error);
        };
    }

}
