import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

// Services
import { AuthService } from '../../providers/auth.service';

// Pages
import { HomePage } from '../home/home';
import { RegisterPage } from '../register/register';

@Component({
    selector: 'page-login',
    templateUrl: 'login.html'
})
export class LoginPage {

    public loginForm = this.formBuilder.group({
        username: ['', [Validators.required]],
        password: ['', [Validators.required]]
    });
    public validationMessages = {
        username: {
            required: 'Username is required.'
        },
        password: {
            required: 'Password is required.'
        }
    };
    public error = '';

    constructor(
        private navCtrl: NavController,
        private formBuilder: FormBuilder,
        private authService: AuthService
    ) { }

    ionViewDidEnter() {
        this.authService.isLoggedIn().subscribe((loggedIn: boolean) => {
            if (loggedIn) {
                this.navCtrl.push(HomePage);
            }
        });
        this.loginForm.valueChanges.subscribe(() => this.onValueChanged());
    }

    public login() {
        this.authService.login(this.loginForm.value.username, this.loginForm.value.password).subscribe(
            (data: any) => {
                this.navCtrl.push(LoginPage);
            },
            (error: any) => {
                if (error.status === 400) {
                    this.error = error.error;
                }
            }
        );
    }

    public logout() {
        this.authService.logout();
    }

    public goToRegister() {
        this.navCtrl.setRoot(RegisterPage);
    }

    private onValueChanged() {
        this.error = '';

        for (const field in this.loginForm.controls) {
            const control = this.loginForm.get(field);
            if (control.dirty && !control.valid && control.errors) {
                for (const type in control.errors) {
                    this.error = this.validationMessages[field][type];
                    return;
                }
            }
        }
    }
}
