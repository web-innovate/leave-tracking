import { inject } from 'aurelia-framework';
import { Router } from 'aurelia-router';
import { ValidationControllerFactory, ValidationRules } from 'aurelia-validation';
import { AuthService } from '~/services/auth-service';
import { ValidationFormRenderer } from '~/validators/validation-form-renderer'
import {NotificationService} from 'aurelia-notify';


@inject(AuthService, Router, ValidationControllerFactory, NotificationService)
export class ForgotPassword {
   user = {
        email: '',
        password: '',
        newPassword: ''
    }
    loading = false;

    rules = ValidationRules
        .ensure('email')
        .required()
        .rules;

    passwordRules = ValidationRules
        .ensure('password')
        .required()
        .ensure('newPassword')
        .required()
        .rules;

    constructor(_auth, router, vCtrl, _notify) {
        this._auth = _auth;
        this.router = router;
        this._notify = _notify;

        this.vCtrl = vCtrl.createForCurrentScope();
        this.vCtrl.addRenderer(new ValidationFormRenderer());
    }

    activate(params) {
        this.recoverKey = params.recoverKey;

        if (this.recoverKey) {
            this.buttonText = "Set password";
        } else {
            this.buttonText = "Send password instructions";
        }
    }

    get canSave() {
        return (this.user.email !== '') ||
            (this.user.password !== '' && this.user.newPassword !== '' ) &&
            this.vCtrl.errors.length === 0;
    }

    recoverPassword() {
        if (this.recoverKey) {
            // call the set passwod api
            this._notify.info('Your password has been set',
                        { containerSelector: '#loginForm', limit: 1 })
        } else {
            // call the reset passwd api
            this._notify.info('An email with the instructions will be sent.',
                        { containerSelector: '#loginForm', limit: 1 })
        }
        setTimeout(() => this.router.navigate('login'), 6000)
    }
}
