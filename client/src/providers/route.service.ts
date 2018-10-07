import { Injectable } from "@angular/core";
import { RequestService } from '../providers/request.service';

import { Observable } from 'rxjs';

const latLj = 46.222;
const lonLj = 15.2992;

@Injectable()
export class RouteService {

    public routeFilter = {
        latitude: latLj,
        longitude: lonLj,
        travelMethod: '',
        travelDuration: '',
        preferences: []
    }

    constructor(public requestService: RequestService) {}

    public setLatLon(lat: number, lon: number) {
        if(!lat || !lon) {
            this.routeFilter.latitude = lat;
            this.routeFilter.longitude = lon;
        }
    }

    public setTravelMethod(travelMethod: string) {
        this.routeFilter.travelMethod = travelMethod;
    }

    public setTravelDuration(travelDuration: string) {
        this.routeFilter.travelDuration = travelDuration;
    }

    public setPreferences(preferences: Array<any>) {
        this.routeFilter.preferences = preferences;
    }

    public getRouteObject() {
        return this.routeFilter;
    }

    public createRoute(): Observable<any> {
        return this.requestService.post('/routes', this.routeFilter)
            .map(response => {
                console.log(response);
                return response;
            });
    }
}
