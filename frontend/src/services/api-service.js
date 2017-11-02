import { singleton, inject } from 'aurelia-framework'
import { HttpClient } from 'aurelia-http-client';
import { NotificationService } from 'aurelia-notify';

@singleton()
@inject(NotificationService)
export class ApiService {
    constructor(_notify) {
        // const backendURL = 'http://localhost:4040/api/';
        const backendURL = 'https://be-leave-tracking.herokuapp.com/api/';
        const that = this;
        this._notify = _notify;

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

        const message = response && response.message || '';

        this._notify.danger(`${error.statusCode} | ${error.statusText} | ${message}`, { timeout: 0 });
        return Promise.reject(new Error(error.statusText));
    }

    handleResponse(httpResponse) {
        const { response } = httpResponse;

        if (response) {
            return JSON.parse(response)
        }

        return httpResponse;
    }
}
