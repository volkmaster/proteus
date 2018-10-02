import { Injectable, isDevMode } from "@angular/core";
import { environment } from '../environments/environment';
import { environmentProd } from '../environments/environment.prod';

@Injectable()
export class EnvironmentService {

    public get(key: string): any {
        return isDevMode() ? environment[key] : environmentProd[key];
    }

}
