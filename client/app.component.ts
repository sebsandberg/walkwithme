import { Component, ViewChild } from "@angular/core";
import { Http, Headers, RequestOptions, Response } from "@angular/http";
import { SemanticPopupComponent } from "ng-semantic";
import "rxjs/add/operator/map";

@Component({
    selector: "app",
    templateUrl: `client/templates/app.html`
})
export class AppComponent {
    appName: string = "Angular 2 Express";
    user: any = {
        password: "angualr2express",
        username: "john"
    };

    isLogged: boolean;
    response: { hashed: string, salt: string };
    @ViewChild("myPopup") myPopup: SemanticPopupComponent;

    constructor(private http: Http) {
        this.isLogged = !!localStorage.getItem("id_token");
    }

    signup() {
        this.http.post("/login/signup", JSON.stringify({ password: this.user.password, username: this.user.username }), new RequestOptions({
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
}
