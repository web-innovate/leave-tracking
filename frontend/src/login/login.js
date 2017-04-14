import { inject } from 'aurelia-framework';
import { AuthService } from '../services/auth-service';

@inject(AuthService)
export class Login {
    user = {
        email: '',
        password: ''
    }
    constructor(_authService) {
        this._authService = _authService;
    }

    login() {
        const { email, password } = this.user;

        return this._authService.login(email, password);
    }

    get canSave() {
        return this.user.email !== '' && this.user.password !== '';
    }
}
