import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

// Services
import { AuthService } from '../../providers/auth.service';
import { RouteService } from '../../providers/route.service';

// Pages
import { LoginPage } from '../login/login';
import { FiltersPage } from '../filters/filters';

@Component({
    selector: 'page-home',
    templateUrl: 'home.html'
})
export class HomePage {

    public loading = true;
    public username = '';

    constructor(
        private navCtrl: NavController,
        private authService: AuthService,
        private routeService: RouteService
    ) { }

    ionViewDidLoad() {
        this.loading = true;

        this.authService.getUser().subscribe(
            (user: any) => {
                this.username = user.username.toUpperCase();
                this.loading = false;
            },
            (error: any) => {
                if (error.status === 401) {
                    this.authService.logout();
                    this.navCtrl.setRoot(LoginPage);
                }
                this.loading = false;
            }
        );

        this.routeService.resetRoute();
    }

    public goToFilters() {
        this.navCtrl.push(FiltersPage);
    }

}
