import { Component, ViewChild } from "@angular/core";
import { Http, Headers, RequestOptions, Response } from "@angular/http";
import { SemanticPopupComponent } from "ng-semantic";
import { User } from "./models/user";
import { Walk } from './models/walk';
import { ApiService } from "./service/api.service"
import "rxjs/add/operator/map";

@Component({
    selector: "app",
    templateUrl: `client/templates/app.html`,
    providers: [User]
})
export class AppComponent {
    appName: string = "Angular 2 Express";

    isLogged: boolean;
    response: { hashed: string, salt: string };
    @ViewChild("myPopup") myPopup: SemanticPopupComponent;

    constructor(private http: Http, private user: User, private apiService: ApiService) {
        this.isLogged = !!localStorage.getItem("id_token");
    }

    signup() {
        this.http.post("/login/signup", JSON.stringify({ password: this.user.password, username: this.user.name }), new RequestOptions({
            headers: new Headers({"Content-Type": "application/json"})
        }))
            .map((res: any) => res.json())
            .subscribe(
                (res: Response) => {
                    this.response = res;
                },
                (error: Error) => { console.log(error); }
            );
    }

    login() {
        this.http.post("/login", JSON.stringify({ password: this.user.password }), new RequestOptions({
            headers: new Headers({"Content-Type": "application/json"})
        }))
            .map((res: Response) => res.json())
            .subscribe(
                (res: Response & { jwt: string }) => {
                    localStorage.setItem("id_token", res.jwt);
                    this.isLogged = true;
                    this.myPopup.hide();
                },
                (error: Error) => { console.log(error); }
            );
    }

    logout(): void {
        localStorage.removeItem("id_token");
        this.isLogged = false;
        this.myPopup.hide();
    }

    createWalk() {
        let walk = new Walk()
        walk.creatorUserID = this.user.id;
        walk.departureTime = new Date(2016,09,17,14,55)
        walk.startLatitude = "125"
        walk.startLongitude = "433"
        walk.endLongitude = "1233"
        walk.endLatitude = "1223123123"
        this.apiService.createWalk(walk)
    }
}
