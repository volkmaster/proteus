import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

// Services
import { AuthService } from '../../providers/auth.service';

// Pages
import { FiltersPage } from '../filters/filters';
import { LoginPage } from '../login/login';

// Custom validators
import { PasswordValidation } from '../../providers/password.validator';

@Component({
    selector: 'page-register',
    templateUrl: 'register.html'
})
export class RegisterPage {

    public registerForm = this.formBuilder.group({
        username     : ['', [Validators.required, Validators.minLength(3)]],
        password     : ['', [Validators.required, Validators.minLength(6)]],
        passwordConf : ['', [Validators.required, Validators.minLength(6)]]
    }, {
        validator : PasswordValidation.matchPassword
    });
    public validationMessages = {
        username: {
            required: 'Username is required.',
            minlength: 'Username must be at least 3 characters long.'
        },
        password: {
            required: 'Password is required.',
            minlength: 'Password must be at least 6 characters long.'
        },
        passwordConf: {
            required: 'Password confirmation is required.',
            minlength: 'Password confirmation must be at least 6 characters long.'
        },
        passwordValidator: {
            mismatch: 'Passwords must match.'
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

        if(this.registerForm.get('passwordConf').getError('MatchPassword')) {
            this.error = this.validationMessages.passwordValidator.mismatch;
            return;
        }

        if(!this.registerForm.valid) {
            return;
        }

        // Validation has passed
        this.authService.register(this.registerForm.value.username, this.registerForm.value.password).subscribe(
            data => {
                this.navCtrl.push(LoginPage, {message: 'Your registration was successful. Please log in using your username and password.'});
            },
            error => {
                console.log(error);
            });
    }

    public toLogin() {
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
