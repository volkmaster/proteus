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

    private transportMap = {
        1: 'driving',
        2: 'walking',
        3: 'bicycling',
        4: 'transit'
    }

    constructor(
        private navCtrl: NavController,
        private launchNavigator: LaunchNavigator,
        private toastService: ToastService
    ) { }

    ionViewDidLoad() {
        //this.launchGoogleMaps();
    }

    private launchGoogleMaps(transportMode: number = 2) {
        // build path
        const indices = [1, 2, 3, 4, 5];
        let destination = '';
        for (let i = 0; i < indices.length - 1; i++) {
          destination += `${this.formatCoordinates(dediscina[indices[i]])}+to:`;
        }
        destination += this.formatCoordinates(dediscina[indices[indices.length - 1]]);

        // launch Google Maps app
        this.launchNavigator.isAppAvailable(this.launchNavigator.APP.GOOGLE_MAPS).then((isAvailable: boolean) => {
            const options: LaunchNavigatorOptions = {
                app: this.launchNavigator.APP.GOOGLE_MAPS,
                transportMode: this.transportMap[transportMode]
            };

            if (isAvailable) {
                this.launchNavigator.navigate(destination)
                    .then(() => this.onMapsSuccess())
                    .catch(error => this.onMapsError(error));
            }
        });
    }

    private formatCoordinates(location: any): string {
        return `${location['WGS.X']},${location['WGS.Y']}`
    }

    private onMapsSuccess() {
        this.toastService.show('Maps successfully launched.', 5000);
    }

    private onMapsError(error: string) {
        this.toastService.show('Error launching maps ' + error, 5000);
    }

}
