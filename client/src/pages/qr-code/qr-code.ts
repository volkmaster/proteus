import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { QRScanner, QRScannerStatus } from '@ionic-native/qr-scanner';
import { Subscription } from 'rxjs/Subscription';

// Pages
import { DetailsPage } from '../details/details';

@Component({
  selector: 'page-qr-code',
  templateUrl: 'qr-code.html'
})
export class QrCodePage {

    private qrScannerSubscription: Subscription;
    private location = {
        title: 'Palača Kazina',
        description: 'Večnamenska javna palača, zgrajena 1835-1837 pod vodstvom V. Vadnava, je strogo klasicistična arhitektura, ki odraža racionalizem 1. polovice 19. stol. Krasitvena dela v dvorani iz 19. stol. dopolnjujejo interierji v slogu funkcionalizma.',
        startTime: '10:45',
        endTime: '11:45',
        sound: 'uniqueId1',
        icon: 'castle',
        image: 'kazina.jpg'
    };

    constructor(
        private navCtrl: NavController,
        private qrScanner: QRScanner
    ) { }

    ionViewDidLoad() {
        this.scanQrCode();
    }

    private scanQrCode() {
        this.qrScanner.prepare()
            .then((status: QRScannerStatus) => {
                // camera permission was granted
                if (status.authorized) {
                    // start scanning
                    this.qrScannerSubscription = this.qrScanner.scan().subscribe((text: string) => {
                        console.log('Scanned something', text);

                        this.navCtrl.push(DetailsPage, { location: this.location });

                        // hide camera preview
                        this.qrScanner.hide();

                        // stop scanning
                        this.qrScannerSubscription.unsubscribe();
                    });

                    this.qrScanner.resumePreview();
                    this.qrScanner.show();
                }
            })
            .catch(error => console.log(error));
    }

    ionViewCanLeave() {
        window.document.querySelector('body').classList.remove('transparent-body');
        this.qrScanner.destroy();
    }

    public close() {
        this.navCtrl.pop();
    }

}
