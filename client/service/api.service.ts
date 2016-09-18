import { Injectable } from "@angular/core";
import { AuthHttp } from "angular2-jwt";
import "rxjs/add/operator/map";
import { Http, Headers, RequestOptions, Response } from "@angular/http";


import { Walk } from "../models/walk"

@Injectable()
export class ApiService {

    constructor(private authHttp: AuthHttp, private http: Http) {}

    get(url: string) {
        return this
            .authHttp
            .get(url)
            .map((response: Response) => response.json());
    }

    getWalks(){
        return this.http.get("/api/get-walk-paths").map((res: any) => res.json())
    }

    createWalk(walk: Walk) {
        return this.http.post("/api/new-walk-path", JSON.stringify(walk), new RequestOptions({
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
}
