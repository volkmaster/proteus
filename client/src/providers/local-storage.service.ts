import { Injectable } from '@angular/core';

@Injectable()
export class LocalStorageService {

    constructor() { }

    public get(key: string): string {
        return localStorage.getItem(key);
    }

    public set(key: string, value: string) {
        localStorage.setItem(key, value);
    }

    public delete(key: string) {
        localStorage.removeItem(key);
    }

}
