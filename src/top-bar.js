import { inject } from 'aurelia-framework';
import { AuthService } from './login/auth-service';

@inject(AuthService)
export class TopBar {
  constructor(auth) {
    this.auth = auth;
    this.user = {
        name: 'my usera'
    }
  }
}
