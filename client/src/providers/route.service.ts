import { Injectable } from "@angular/core";

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
}
