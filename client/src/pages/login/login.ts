import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

// Services
import { AuthService } from '../../providers/auth.service';

// Pages
import { FiltersPage } from '../filters/filters';

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
                this.navCtrl.push(FiltersPage);
            }
            this.loginForm.valueChanges.subscribe(() => this.onValueChanged());
        });
    }

    public login() {
        this.authService.login(this.loginForm.value.username, this.loginForm.value.password).subscribe(
            data => {
                this.navCtrl.push(FiltersPage);
            },
            error => {
                console.log(error);
            });
    }

    public logout() {
        this.authService.logout();
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
