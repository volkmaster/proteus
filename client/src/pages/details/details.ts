import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { NativeAudio } from '@ionic-native/native-audio';

// Services
import { ToastService } from '../../providers/toast.service';

// Pages
import { DashboardPage } from '../dashboard/dashboard';

@Component({
    selector: 'page-details',
    templateUrl: 'details.html'
})
export class DetailsPage {

    public loading = false;
    public object: any = null;

    constructor(
        private navCtrl: NavController,
        private navParams: NavParams,
        private nativeAudio: NativeAudio,
        private toastService: ToastService
    ) { }

    ionViewDidLoad() {
        if (this.navParams.get('location')) {
            this.object = this.navParams.get('location');
        }
    }

    public playAudio() {
        if (this.object) {
            this.nativeAudio.play(this.object.sound);
        } else {
            this.toastService.show('This location does not have a detailed audio description.', 2000, 'bottom');
        }
    }

    public close() {
        this.navCtrl.setRoot(DashboardPage)
    }

    ionViewWillLeave() {
        this.nativeAudio.stop(this.object.sound);
    }

}
