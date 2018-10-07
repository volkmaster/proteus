import { Component, Input } from '@angular/core';
import { NavController } from 'ionic-angular';

// Services
import { AuthService } from '../../providers/auth.service';

// Pages
import { HomePage } from '../../pages/home/home';
import { LoginPage } from '../../pages/login/login';

@Component({
    selector: 'header-component',
    templateUrl: 'header.component.html',
})
export class HeaderComponent {

    @Input() public background = '#EF4C24';
    @Input() public logo = {
        theme: 'light',
        visible: true,
        action: ''
    };
    @Input() public left = {
        text: '',
        goTo: '',
        color: '#EE9077'
    };
    @Input() public right = {
        text: '',
        goTo: '',
        color: '#EE9077'
    };

    constructor(
        private navController: NavController,
        private authService: AuthService
    ) { }

    public performAction(action: string) {
        switch (action) {
            case 'home':
                this.navController.setRoot(HomePage);
                break;
            case 'logout':
                this.authService.logout();
                this.navController.setRoot(LoginPage);
                break;
        }
    }
}
