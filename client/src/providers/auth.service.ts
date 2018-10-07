import { Injectable } from "@angular/core";
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

// Services
import { LocalStorageService } from './local-storage.service';
import { RequestService } from './request.service';

@Injectable()
export class AuthService {

    private token;

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
            .map(response => {
                this.token = response.token;
                this.saveToken();
            });
    }

    public logout() {
        this.token = '';
        this.deleteToken();
    }

    public isLoggedIn(): Observable<boolean> {
        return this.requestService.get('/auth/verify');
    }

    public getToken() {
        return this.token;
    }

    private saveToken() {
        this.localStorageService.set('TOKEN', this.token);
    }

    private loadToken() {
        this.token = this.localStorageService.get('TOKEN');
    }

    private deleteToken() {
        this.localStorageService.delete('TOKEN');
    }

}
