import BaseUser from './base-user';

export class CreateUser extends BaseUser {
    user = {
            firstName: '',
            lastName: '',
            email: '',
            password: '',
            position: '',
            projectId: 'None',
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
