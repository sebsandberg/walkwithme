import { Component } from "@angular/core";
import { ApiService } from "../../service/api.service";
import { Walk } from "../../models/walk";
import {SebmGoogleMap, SebmGoogleMapPolyline, SebmGoogleMapPolylinePoint} from
'angular2-google-maps/core';

@Component({
    selector: "home",
    templateUrl: `client/modules/home/home.component.html`
})
export class HomeComponent {
    walks: Walk[]
    showMap: boolean = false
    createWalk: boolean = false
    lat: number = 43.4722152
    lng: number = -80.5420159
    zoom: number = 16
    error: string;
    response: {};
    newWalk: Walk = new Walk()
    constructor(private apiService: ApiService) {
        this.apiService.getWalks().subscribe(res => {
            this.walks = res;
        })

        this.newWalk.creatorUserID = "John Smith"
        this.newWalk.creatorUserID = "Ramy Z";//this.user.id;
        this.newWalk.departureTime = new Date(2016,09,18,23,59)
        this.newWalk.startLatitude = "43.4752375"
        this.newWalk.startLongitude = "-80.5265779"
        this.newWalk.endLatitude = "43.4700123"
        this.newWalk.endLongitude = "-80.5370593"
        this.newWalk.description = "Bar to home"
        this.newWalk.startAddress = "Phils"
        this.newWalk.endAddress = "University of Waterloo place"

    }

    toggleCreateWalk(){
        if (this.showMap) this.showMap = false
        this.createWalk = !this.createWalk
    }

    toggleMap(){
        if (this.createWalk) this.createWalk = false
        this.showMap = !this.showMap
    }

    convertToNum(str) {
        return parseFloat(str)
    }

    submitWalk(){
        this.apiService.createWalk(this.newWalk)
        this.apiService.getWalks().subscribe(res => {
            this.walks = res
        }

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
