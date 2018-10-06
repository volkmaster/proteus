import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { AuthService } from '../../providers/auth.service';

@Component({
    selector: 'page-register',
    templateUrl: 'register.html'
})
export class RegisterPage {
    public fgRegister: FormGroup;
    public usr: any = null;

    constructor(private authService: AuthService,
                private fb: FormBuilder,
                private navCtrl: NavController) {}


    public validationMessages = {
        'username': {
            'required':     'Missing username',
            'minlength':    'Username too short'
        },
        'password': {
            'required':     'Missing password',
            'minlength':    'Password should be at least 6 characters long.'
        }
    };

    public formErrors = {
        'username': '',
        'password': '',
    };

}
