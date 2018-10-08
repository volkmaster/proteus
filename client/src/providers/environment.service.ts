import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { environmentProd } from '../environments/environment.prod';

@Injectable()
export class EnvironmentService {

    private isDevMode: boolean = ((<any>window)['IonicDevServer'] != undefined);

    public get(key: string): any {
        return this.isDevMode ? environment[key] : environmentProd[key];
    }

}
