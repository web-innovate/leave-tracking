import BaseUser from './base-user';

export class CreateUser extends BaseUser {
    user = {
            firstName: '',
            lastName: '',
            email: '',
            password: '',
            position: '',
            projectId: 0,
            holidays: 0,
            userType: ''
        };

    activate() {
        this.setTemplateParams();
    }

    setTemplateParams() {
        this.ctaButtonLabel = 'Create user';
    }

    submit() {
        this.create();
    }
}
