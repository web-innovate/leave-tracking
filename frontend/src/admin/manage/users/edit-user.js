import BaseUser from './base-user';

export class EditUser extends BaseUser {

    async activate(params) {
        this.setTemplateParams();
        await this.fetchData(params);
    }

    attached() {
        ValidationRules
            .ensure('startDate').satisfies(obj => obj instanceof Date)
            .ensure('firstName').required()
            .ensure('lastName').required()
            .ensure('email').required().email()
            .ensure('daysPerYear').satisfiesRule('integerRange', 0, 500)
            .ensure('holidays').satisfiesRule('integerRange', 0, 500)
            .ensure('position').satisfiesRule('otherThan', 'None', true)
            .ensure('userType').satisfiesRule('otherThan', 'None')
            .ensure('projectId').satisfiesRule('otherThan', 'None', true)
            .on(this.user);
    }

    setTemplateParams() {
        this.ctaButtonLabel = 'Save';
        this.isEdit = true;
    }

    async fetchData(params) {
        this.user = await this._user.getUser(params.userId);
        this.user.submit = this.save.bind(this);

        await this.fetchProjectRoles(this.user.projectId);
    }

    async delete() {
        await this._user.deleteUser(this.user._id);
        this.router.navigateBack();
    }
}
