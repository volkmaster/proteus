import { Injectable } from '@angular/core';
import { Geolocation, Geoposition } from '@ionic-native/geolocation';

@Injectable()
export class GeoService {

    constructor(private geolocation: Geolocation) { }

    public getLocation(): Promise<any> {
        return new Promise((resolve, reject) => {
            this.geolocation.getCurrentPosition()
                .then((data: Geoposition) => {
                    if (data && data['code'] != 1) {
                        resolve({
                            lat: data.coords.latitude,
                            long: data.coords.longitude,
                        });
                    } else {
                        reject();
                    }
                })
                .catch((error) => reject());
        });
    }

}
