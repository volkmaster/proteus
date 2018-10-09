import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { NativeAudio } from '@ionic-native/native-audio';

// Services
import { AuthService } from '../../providers/auth.service';
import { ToastService } from '../../providers/toast.service';

// Pages
import { LoginPage } from '../login/login';

@Component({
    selector: 'page-details',
    templateUrl: 'details.html'
})
export class DetailsPage {

    public loading = false;
    public username = '';
    public object = null;

    constructor(
        private navCtrl: NavController,
        private navParams: NavParams,
        private nativeAudio: NativeAudio,
        private authService: AuthService,
        private toastService: ToastService
    ) { }

    ionViewDidLoad() {
        this.username = 'TINA';

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
        this.navCtrl.pop();
    }

    ionViewWillLeave() {
        this.nativeAudio.stop(this.object.sound);
    }

}
