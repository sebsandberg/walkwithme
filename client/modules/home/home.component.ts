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
    showList: boolean = true
    lat: number = 43.4722152
    lng: number = -80.5420159
    zoom: number = 16
    error: string;
    response: {};
    newWalk: Walk = new Walk()
    displayedWalk: Walk
    constructor(private apiService: ApiService) {
        this.apiService.getWalks().subscribe(res => {
            console.log(res)
            this.walks = res;
        })

        this.newWalk.CreatorUserID = "Ramy Z";//this.user.id;
        this.newWalk.DepartureTime = new Date(2016,09,18,23,59)
        this.newWalk.StartLatitude = "43.4752375"
        this.newWalk.StartLongitude = "-80.5265779"
        this.newWalk.EndLatitude = "43.4700123"
        this.newWalk.EndLongitude = "-80.5370593"
        this.newWalk.Description = "Bar to home"
        this.newWalk.StartAddress = "Phils"
        this.newWalk.EndAddress = "University of Waterloo place"

    }

    toggleCreateWalk(){
        if (this.showMap) this.showMap = false
        if (this.showList) this.showList = false
        this.createWalk = true
    }

    toggleMap(){
        if (this.createWalk) this.createWalk = false
        if (this.showList) this.showList = false
        this.showMap = true
    }

    toggleList() {
        if (this.createWalk) this.createWalk = false
        if (this.showMap) this.showMap = false
        this.showList = true
    }

    joinWalk(walk: Walk){
        walk.UsersInGroup.push('{name:"John"}')
        walk.HasJoined = true
    }

    leaveWalk(walk: Walk){
        walk.UsersInGroup.pop()
        walk.HasJoined = false
    }
    markerClick(walk: Walk){
        console.log("marker clik", walk)
    }
    showWalk (walk: Walk){
        console.log("line with walk", walk)
        this.displayedWalk = walk
    }


    convertToNum(str) {
        return parseFloat(str)
    }

    submitWalk() {
        this.apiService.createWalk(this.newWalk)
        this.newWalk = new Walk()
        this.apiService.getWalks().subscribe(res => {
            this.walks = res
        })
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
