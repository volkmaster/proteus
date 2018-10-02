import { Injectable } from "@angular/core";
import { ToastController } from 'ionic-angular';

@Injectable()
export class ToastService {

    constructor(private toastCtrl: ToastController) { }

    public show(message: string, duration: number = 1000, position: string = 'bottom') {
        this.toastCtrl.create({ message, duration, position }).present();
    }

}
