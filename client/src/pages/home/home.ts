import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

// Pages
import { FiltersPage } from '../filters/filters';

@Component({
    selector: 'page-home',
    templateUrl: 'home.html'
})
export class HomePage {

    constructor(private navCtrl: NavController) { }

    ionViewDidLoad() { }

    public goToFilters() {
        this.navCtrl.push(FiltersPage);
    }

}
