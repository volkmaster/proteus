import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { AuthService } from '../../providers/auth.service';

import { DashboardPage } from '../dashboard/dashboard';
@Component({
    selector: 'page-login',
    templateUrl: 'login.html'
})
export class LoginPage {
    public fgLogin: FormGroup;
    public usr: any = null;

    constructor(private authService: AuthService,
                private fb: FormBuilder,
                private navCtrl: NavController) {}

    ionViewDidEnter() {
        if(this.authService.isLoggedIn()) {
            this.navCtrl.push(DashboardPage);
        }
    }

    public validationMessages = {
        'username': {
            'required':     'Missing username',
            'minlength':    'Username too short'
        },
        'password': {
            'required':     'Missing password'
        }
    };

    public formErrors = {
        'username': '',
        'password': '',
    };

    public login(){
        this.authService.login(this.fgLogin.value.username, this.fgLogin.value.password)
            .subscribe((data) => {
                console.log(data);
            }, error => {
                console.log(error);
            });
    }

    public logout(){
        this.authService.logout();
    }

    private buildForm() {
        this.fgLogin = this.fb.group({
            'username': ['', [
                    Validators.required,
                    Validators.minLength(1),
                ]
            ],
            'password': ['', [Validators.required]]
        });
        this.fgLogin.valueChanges.subscribe(
            data => this.onValueChanged(data)
        )
        this.onValueChanged();
    }

    private onValueChanged(data?: any) {
        if (!this.fgLogin) { return; }
        const form = this.fgLogin;

        for (const field in this.formErrors) {
            this.formErrors[field] = '';
            const control = form.get(field);

            if (control && control.dirty && !control.valid) {
                const messages = this.validationMessages[field];
                for (const key in control.errors) {
                    this.formErrors[field] += messages[key] + ' ';
                }
            }
        }
    }
}
