import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { LaunchNavigator, LaunchNavigatorOptions } from '@ionic-native/launch-navigator';

// Services
import { ToastService } from '../../providers/toast.service';

// Data
import { dediscina } from '../../assets/data/dediscina';

@Component({
    selector: 'page-maps',
    templateUrl: 'maps.html'
})
export class MapsPage {

    constructor(
        private navCtrl: NavController,
        private launchNavigator: LaunchNavigator,
        private toastService: ToastService
    ) { }

    ionViewDidLoad() {
        this.launchGoogleMaps();
    }

    private launchGoogleMaps() {
        const indices = [1, 2, 3, 4, 5];

        const options: LaunchNavigatorOptions = { app: this.launchNavigator.APP.GOOGLE_MAPS };

        let destination = '';
        for (let i = 0; i < indices.length - 1; i++) {
          destination += `${this.formatCoordinates(indices[i])}+to:`;
        }
        destination += this.formatCoordinates(indices[indices.length - 1]);

        this.launchNavigator.navigate(destination, options).then(
            success => this.toastService.show('Google Maps works.'),
            error => this.toastService.show('Google Maps does not work')
        );
    }

    private formatCoordinates(index: number): string {
        return `${dediscina[index]['WGS.X']},${dediscina[index]['WGS.Y']}`
    }

}
