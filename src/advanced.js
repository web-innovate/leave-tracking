import { inject } from 'aurelia-framework';
import { AuthService } from './login/auth-service';

@inject(AuthService)
export class Advanced {
    constructor(auth){
        this.auth = auth
    };
}
