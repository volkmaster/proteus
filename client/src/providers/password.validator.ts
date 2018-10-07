import {AbstractControl} from '@angular/forms';

export class PasswordValidation {

    static matchPassword(ac: AbstractControl) {
       let password = ac.get('password').value;
       let confirmPassword = ac.get('passwordConf').value;
        if(password != confirmPassword) {
            console.log('false');
            ac.get('passwordConf').setErrors( {MatchPassword: true} )
        } else {
            console.log('true');
            return null
        }
    }
}
