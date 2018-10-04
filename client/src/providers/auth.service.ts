import { Injectable } from "@angular/core";
import { Observable } from 'rxjs/Observable';

// Services
import { RequestService } from './request.service';

@Injectable()
export class AuthService {

    private token: string = '';

    constructor(private requestService: RequestService) { }

    public login(username: string, password: string): Observable<any> {
        return this.requestService.post('/auth/login', { username, password });
    }

    public isLoggedIn(): Observable<boolean> {
        return this.requestService.get('/auth/verify');
    }

    public logout() {
        this.token = '';
    }

    public getAuthorizationHeaderValue() {
        return `Bearer ${this.token}`;
    }

}
