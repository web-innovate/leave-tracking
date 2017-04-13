import { singleton } from 'aurelia-framework'
import { HttpClient } from 'aurelia-http-client';

@singleton()
export class Api {
    constructor() {
        // const backendURL = 'http://localhost:4040/api/';
        const backendURL = 'https://be-leave-tracking.herokuapp.com/api/';

        this.a = new HttpClient().configure(x => {
            x.withHeader('Content-Type', 'application/json');
            x.withBaseUrl(backendURL);
          //x.withCredentials(true);
        });
    }

    get http() {
        return this.a;
    }
}
