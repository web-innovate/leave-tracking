import { singleton } from 'aurelia-framework'
import { HttpClient } from 'aurelia-http-client';
import environment from '~/environment';

@singleton()
export class ApiService {
    constructor() {
        const backendURL = environment.API_URL;
        const that = this;

        this.httpClient = new HttpClient().configure(x => {
            x.withHeader('Content-Type', 'application/json');
            x.withBaseUrl(backendURL);
            x.withInterceptor({
                response(httpResponse) { return that.handleResponse(httpResponse); },
                requestError(error) { return that.handleError(error); },
                responseError(error) { return that.handleError(error); }
            });
        });

        const existingToken = localStorage.getItem('token') || null;

        if (existingToken) {
            this.attachToken(existingToken);
        }
    }

    get http() {
        return this.httpClient;
    }

    attachToken(token) {
        this.httpClient.configure(config => {
            config.withHeader('Authorization', `Bearer ${token}`)
        })
    }

    handleError(error) {
        const response = JSON.parse(error.response);

        return Promise.reject(response);
    }

    handleResponse(httpResponse) {
        const { response } = httpResponse;

        if (response) {
            return JSON.parse(response)
        }

        return httpResponse;
    }
}
