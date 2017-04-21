import { inject } from 'aurelia-framework';
import { AuthService } from '~/services/auth-service';
import { Router } from 'aurelia-router';

@inject(AuthService, Router)
export class Login {
    user = {
        email: '',
        password: ''
    }
    loginError = false;
    loading = false;

    constructor(_authService, router) {
        this._authService = _authService;
        this.router = router;
    }

    login() {
        const { email, password } = this.user;
        this.loading = true;
        return this._authService.login(email, password)
            .then(() => {
                this.loading = false;
                this.router.navigateToRoute('home');
            })
            .catch((err) => {
                this.loginError = true;
                this.loading = false;
            })
    }

    get canSave() {
        return this.user.email !== '' && this.user.password !== '';
    }
}
