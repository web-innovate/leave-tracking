import { inject } from 'aurelia-framework';
import { AuthService } from '~/services/auth-service';
import { Router } from 'aurelia-router';

@inject(AuthService, Router)
export class Login {
    user = {
        email: '',
        password: ''
    }

    constructor(_authService, router) {
        this._authService = _authService;
        this.router = router;
    }

    login() {
        const { email, password } = this.user;

        return this._authService.login(email, password)
            .then(() => this.router.navigateToRoute('home'))
    }

    get canSave() {
        return this.user.email !== '' && this.user.password !== '';
    }
}
