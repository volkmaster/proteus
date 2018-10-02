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
        1 : 'driving',
        2 : 'walking',
        3 : 'bicycling',
        4 : 'transit',
    }
    constructor(
        private navCtrl: NavController,
        private launchNavigator: LaunchNavigator,
        private toastService: ToastService
    ) { }

    ionViewDidLoad() {
        //this.launchGoogleMaps();
    }

    /**
     *
     * @param transportMode integer that represents different options for transport mode
     * 1 - Driving
     * 2 - Walking
     * 3 - Bicycling
     * 4 - Transit
     */
    private launchGoogleMaps(transportMode: number) {
        const indices = [1, 2, 3, 4, 5];

        const options: LaunchNavigatorOptions = { app: this.launchNavigator.APP.GOOGLE_MAPS };

        let destination = '';
        for (let i = 0; i < indices.length - 1; i++) {
          destination += `${this.formatCoordinates(indices[i])}+to:`;
        }
        destination += this.formatCoordinates(indices[indices.length - 1]);

        this.launchNavigator.isAppAvailable(this.launchNavigator.APP.GOOGLE_MAPS).then((isAvailable) => {
            var app;

            var transMode = this.transportMap[transportMode];
            transMode = transMode == null ? this.transportMap[1] : transMode;

            let options: LaunchNavigatorOptions = {
                app: app,
                transportMode: transMode
              };

            if(isAvailable) {
                app = this.launchNavigator.APP.GOOGLE_MAPS;

                this.launchNavigator.navigate(destination)
                .then(() => {this.onMapsSuccess();})
                .catch(err => {this.onMapsError(err);});
            }


        });
    }

    private onMapsError(error: string) {
        this.toastService.show("Error launching maps " + error, 5000);
    }

    private onMapsSuccess() {
        this.toastService.show("Maps successfully launched.", 5000);
    }

    private formatCoordinates(index: number): string {
        return `${dediscina[index]['WGS.X']},${dediscina[index]['WGS.Y']}`
    }

}
