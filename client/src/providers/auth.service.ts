import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/catch';

// Services
import { LocalStorageService } from './local-storage.service';
import { RequestService } from './request.service';

@Injectable()
export class AuthService {

    private user = null;
    private token: string;

    constructor(
        private localStorageService: LocalStorageService,
        private requestService: RequestService
    ) {
        this.loadToken();
    }

    public register(username: string, password: string): Observable<any> {
        return this.requestService.post('/auth/register', { username, password });
    }

    public login(username: string, password: string): Observable<any> {
        return this.requestService.post('/auth/login', { username, password })
            .map((response: any) => {
                this.token = response.token;
                this.saveToken();
            });
    }

    public logout() {
        this.user = null;
        this.token = '';
        this.deleteToken();
    }

    public isLoggedIn(): Observable<boolean> {
        return this.requestService.get('/auth/verify')
            .catch((error: any) => {
                return Observable.of(false);
            });
    }

    public getUser(): Observable<any> {
        if (this.user) {
            return Observable.of(this.user);
        }

        return this.requestService.get('/users/me')
            .map((response: any) => {
                this.user = response;
                return this.user;
            });
    }

    public getToken() {
        return this.token;
    }

    private saveToken() {
        this.localStorageService.set('TOKEN', this.token);
    }

    private loadToken() {
        const token = this.localStorageService.get('TOKEN');
        this.token = token ? token : '';
    }

    private deleteToken() {
        this.localStorageService.delete('TOKEN');
    }

}
