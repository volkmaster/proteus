import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { FormBuilder, Validators } from '@angular/forms';

// Services
import { AuthService } from '../../providers/auth.service';

// Pages
import { HomePage } from '../home/home';
import { LoginPage } from '../login/login';

// Validators
import { PasswordValidator } from '../../shared/password.validator';

@Component({
    selector: 'page-register',
    templateUrl: 'register.html'
})
export class RegisterPage {

    public loading = true;
    public registerForm = this.formBuilder.group({
        username: ['', [Validators.required, Validators.minLength(3)]],
        password: ['', [Validators.required, Validators.minLength(6)]],
        passwordConfirmation: ['', [Validators.required, Validators.minLength(6)]]
    }, { validator: PasswordValidator.matchPassword });
    public validationMessages = {
        username: {
            required: 'Username is required.',
            minlength: 'Username must be at least 3 characters long.'
        },
        password: {
            required: 'Password is required.',
            minlength: 'Password must be at least 6 characters long.'
        },
        passwordConfirmation: {
            required: 'Password is required.',
            minlength: 'Password must be at least 6 characters long.',
            matchPassword: 'Passwords must match.'
        }
    };
    public error = '';

    constructor(
        private navCtrl: NavController,
        private formBuilder: FormBuilder,
        private authService: AuthService
    ) { }

    ionViewDidEnter() {
        this.registerForm.valueChanges.subscribe(() => this.onValueChanged());
    }

    public register() {
        if (!this.registerForm.valid) {
            return;
        }

        this.navCtrl.push(LoginPage, { message: 'Registration was successful. Please log in with your username and password.' });
    }

    public goToLogin() {
        this.navCtrl.setRoot(LoginPage);
    }

    private onValueChanged() {
        this.error = '';

        for (const field in this.registerForm.controls) {
            const control = this.registerForm.get(field);
            if (control.dirty && !control.valid && control.errors) {
                for (const type in control.errors) {
                    this.error = this.validationMessages[field][type];
                    return;
                }
            }
        }
    }

}
