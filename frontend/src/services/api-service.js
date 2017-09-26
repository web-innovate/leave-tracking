import { singleton, inject } from 'aurelia-framework'
import { HttpClient } from 'aurelia-http-client';
import { NotificationService } from 'aurelia-notify';

@singleton()
@inject(NotificationService)
export class ApiService {
    constructor(_notify) {
        // const backendURL = 'http://localhost:4040/api/';
        const backendURL = 'https://be-leave-tracking.herokuapp.com/api/';

        this.httpClient = new HttpClient().configure(x => {
            x.withHeader('Content-Type', 'application/json');
            x.withBaseUrl(backendURL);
            x.withInterceptor({
                requestError(error) {
                    _notify.danger(`${error.statusCode}|${error.statusText}`, { timeout: 0 });
                    return Promise.reject(new Error(error));
                },
                responseError(error) {
                    _notify.danger(`${error.statusCode}|${error.statusText}`, { timeout: 0 });
                    return Promise.reject(new Error(error));
                }
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
}
