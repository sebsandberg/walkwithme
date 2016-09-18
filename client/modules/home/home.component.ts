import { Component } from "@angular/core";
import { ApiService } from "../../service/api.service";
import {SebmGoogleMap, SebmGoogleMapPolyline, SebmGoogleMapPolylinePoint} from
'angular2-google-maps/core';

@Component({
    selector: "home",
    templateUrl: `client/modules/home/home.component.html`
})
export class HomeComponent {
    lat: number = 43.4722152
    lng: number = -80.5420159
    latB: number = 43.4679508
    lngB: number = -80.5416352
    zoom: number = 16
    error: string;
    response: {};
    constructor(private apiService: ApiService) {
        this.apiService.getWalks()
    }

    protected() {
        this.apiService
            .get("/api")
            .subscribe(
                (data) => { this.response = data; },
                (error: Error) => {
                    this.error = error.message;
                    setTimeout(() => this.error = null, 4000)
                });
    }
}
