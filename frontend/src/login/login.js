import { inject } from 'aurelia-framework';
import { Router } from 'aurelia-router';
import { ValidationControllerFactory, ValidationRules } from 'aurelia-validation';
import { AuthService } from '~/services/auth-service';
import { ValidationFormRenderer } from '~/validators/validation-form-renderer'

@inject(AuthService, Router, ValidationControllerFactory)
export class Login {
    user = {
        email: '',
        password: ''
    }
    loginError = false;
    loading = false;

    rules = ValidationRules
        .ensure('email')
        .required()
        // .email()
        .ensure('password')
        .required()
        .rules;

    constructor(_authService, router, vCtrl) {
        this._authService = _authService;
        this.router = router;
        this.vCtrl = vCtrl.createForCurrentScope();
        this.vCtrl.addRenderer(new ValidationFormRenderer());
    }


    login() {
        const { email, password } = this.user;
        this.loading = true;
        return this.vCtrl.validate()
            .then(re => {
                if (re.valid) {
                    return this._authService.login(email, password);
                } else {
                    return Promise.reject();
                }
            })
            .then((me) => {
                if ( me.userType === 'ADMIN' ) {
                    this.router.navigateToRoute('admin');
                } else {
                    this.router.navigateToRoute('home');
                }
                this.loading = false;
            })
            .catch((err) => {
                this.loginError = true;
                this.loading = false;
            })
    }

    get canSave() {
        return this.user.email !== ''
            && this.user.password !== ''
            && this.vCtrl.errors.length === 0;
    }
}
