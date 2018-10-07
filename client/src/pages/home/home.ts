import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

// Services
import { AuthService } from '../../providers/auth.service';
import { RouteService } from '../../providers/route.service';

// Pages
import { FiltersPage } from '../filters/filters';

@Component({
    selector: 'page-home',
    templateUrl: 'home.html'
})
export class HomePage {

    public username = '';

    constructor(
        private navCtrl: NavController,
        private authService: AuthService,
        private routeService: RouteService
    ) { }

    ionViewDidLoad() {
        this.authService.getUser().subscribe((user: any) => {
            this.username = user.username.toUpperCase();
        });

        this.routeService.resetRoute();
    }

    public goToFilters() {
        this.navCtrl.push(FiltersPage);
    }

}
