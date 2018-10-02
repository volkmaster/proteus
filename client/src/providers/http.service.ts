import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class HttpService {

    private readonly _contentTypes = {
        html: 'text/html',
        javascript: 'application/javascript',
        json: 'application/json',
        text: 'text/plain',
        pdf: 'application/pdf',
        stream: 'application/octet-stream',
        xml: 'application/xml',
        zip: 'application/zip'
    };

    constructor(private httpClient: HttpClient) { }

    public post(url: string, body: any, headers: { [key: string]: any }, params: { [key: string]: any }, requestType: string, responseType: string): Observable<HttpResponse<any>> {
        return this.httpClient.post<any>(url, body, this.constructOptions(headers, params, requestType, responseType));
    }

    public get(url: string, headers: { [key: string]: any }, params: { [key: string]: any }, responseType: string): Observable<HttpResponse<any>> {
        return this.httpClient.get<any>(url, this.constructOptions(headers, params, '', responseType));
    }

    public put(url: string, body: string, headers: { [key: string]: any }, params: { [key: string]: any }, requestType: string): Observable<HttpResponse<any>> {
        return this.httpClient.put<any>(url, this.constructOptions(headers, params, requestType));
    }

    public patch(url: string, body: string, headers: { [key: string]: any }, params: { [key: string]: any }, requestType: string): Observable<HttpResponse<any>> {
        return this.httpClient.patch<any>(url, this.constructOptions(headers, params, requestType));
    }

    public delete(url: string, headers: { [key: string]: any }, params: { [key: string]: any }): Observable<HttpResponse<any>> {
        return this.httpClient.delete<any>(url, this.constructOptions(headers, params));
    }

    private constructOptions(headers: { [key: string]: any }, params: { [key: string]: any }, requestType = '', responseType = ''): { [key: string]: any } {
        if (requestType) {
            headers['Content-Type'] = this._contentTypes[requestType];
        }

        const options = {
            headers: headers,
            params: params
        };

        if (responseType) {
            options['responseType'] = responseType;
        }

        return options;
    }

}
