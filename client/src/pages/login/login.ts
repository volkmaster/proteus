import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { FormBuilder, Validators } from '@angular/forms';

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

    public loading = false;
    public loginForm = this.formBuilder.group({
        username: ['tina', [Validators.required]],
        password: ['test123', [Validators.required]]
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
        private navParams: NavParams,
        private formBuilder: FormBuilder,
        private authService: AuthService
    ) { }

    ionViewDidEnter() {
        this.loginForm.valueChanges.subscribe(() => this.onValueChanged());
    }

    ionViewDidLoad() {
        this.error = this.navParams.get('message');
    }

    public login() {
        if (!this.loginForm.valid) {
            return;
        }

        this.navCtrl.push(HomePage);
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
