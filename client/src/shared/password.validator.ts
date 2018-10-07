import { AbstractControl } from '@angular/forms';

export class PasswordValidator {

    static matchPassword(control: AbstractControl): { [key: string]: boolean } {
        const password = control.get('password').value;
        const passwordConfirmation = control.get('passwordConfirmation').value;

        if (password != passwordConfirmation) {
            control.get('passwordConfirmation').setErrors({ matchPassword: true });
        } else {
            return null;
        }
    }

}
