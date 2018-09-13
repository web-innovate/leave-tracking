import BaseUser from './base-user';

export class CreateUser extends BaseUser {
    roles = [];
    user = {
            firstName: '',
            lastName: '',
            email: '',
            password: '',
            position: '',
            project: '',
            daysPerYear: 0,
            holidays: 0,
            userType: ''
    };

    activate() {
        this.setTemplateParams();
        this.user.submit = this.create.bind(this);
    }

    setTemplateParams() {
        this.ctaButtonLabel = 'Create user';
    }
}
