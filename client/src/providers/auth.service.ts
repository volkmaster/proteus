import { Injectable } from "@angular/core";
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

// Services
import { RequestService } from './request.service';

@Injectable()
export class AuthService {

    private token: string = '';

    constructor(private requestService: RequestService) { }

    public register(username: string, password: string): Observable<any> {
        return this.requestService.post('/auth/register', { username, password });
    }

    public login(username: string, password: string): Observable<any> {
        return this.requestService.post('/auth/login', { username, password })
            .map(response => {
                this.token = response.token;
            });
    }

    public logout() {
        this.token = '';
    }

    public isLoggedIn(): Observable<boolean> {
        return this.requestService.get('/auth/verify');
    }

    public getAuthorizationHeaderValue() {
        return `Bearer ${this.token}`;
    }

}
