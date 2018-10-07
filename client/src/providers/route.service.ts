import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/of';

// Services
import { RequestService } from './request.service';

// Constants
const DEFAULT_LATITUDE = 46.222;
const DEFAULT_LONGITUDE = 15.2992;

@Injectable()
export class RouteService {

    private filters = null;
    private routeParams = null;
    private route = null;
    // TODO: add appropriate icons
    private icons = {
        'museum': 'home',
        'vrtnoarhitekturna dediščina': 'nature',
        'kulturna krajina': 'nature',
        'naselbinska dediščina': 'farm',
        'memorialna dediščina': 'castle',
        'arheološka dediščina': 'archeology',
        'profana stavbna dediščina': 'home',
        'sakralna stavbna dediščina': 'church'
    };

    constructor(private requestService: RequestService) { }

    public getFilters(): Observable<string[]> {
        if (this.filters) {
            return Observable.of(this.filters);
        }

        return this.requestService.get('/routes/filters')
            .map((response: any) => {
                this.filters = response;
                return this.filters;
            });
    }

    public getRoute(): Observable<any[]> {
        if (this.route) {
            return this.route;
        }

        return this.requestService.post('/routes', this.routeParams)
            .map((response: any) => {
                this.route = response.nodes.map(node => {
                    return {
                        title: node.location.name,
                        description: node.location.descriptionEn,
                        startTime: new Date(node.visitStartTime).toTimeString().substring(0, 5),
                        endTime: new Date(node.visitEndTime).toTimeString().substring(0, 5),
                        sound: null,
                        icon: this.icons[node.location.type],
                        image: null,
                        latitude: node.location.latitude,
                        longitude: node.location.longitude
                    };
                });
                return this.route;
            });
    }

    public resetRoute() {
        this.routeParams = {
            latitude: DEFAULT_LATITUDE,
            longitude: DEFAULT_LONGITUDE,
            travelMethod: '',
            travelDuration: '',
            preferences: []
        }
        this.route = null;
    }

    public setPosition(latitude: number, longitude: number) {
        this.routeParams.latitude = latitude;
        this.routeParams.longitude = longitude;
    }

    public setTravelMethod(travelMethod: string) {
        this.routeParams.travelMethod = travelMethod;
    }

    public setTravelDuration(travelDuration: string) {
        this.routeParams.travelDuration = travelDuration;
    }

    public addPreference(preference: string) {
        this.routeParams.preferences.push(preference);
    }

}
