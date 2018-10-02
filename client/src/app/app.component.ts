import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { NativeAudio } from '@ionic-native/native-audio';

// Pages
import { HomePage } from '../pages/home/home';
import { DashboardPage } from '../pages/dashboard/dashboard';

@Component({
    templateUrl: 'app.html'
})
export class MyApp {

    public rootPage: any = DashboardPage;

    constructor(
        private platform: Platform,
        private statusBar: StatusBar,
        private splashScreen: SplashScreen,
        private nativeAudio: NativeAudio
    ) {
        platform.ready().then(() => {
            statusBar.styleDefault();
            splashScreen.hide();

            this.nativeAudio.preloadSimple('uniqueId1', 'assets/sounds/kazina.mp3');
        });
    }

}
