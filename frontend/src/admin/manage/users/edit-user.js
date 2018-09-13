import BaseUser from './base-user';

export class EditUser extends BaseUser {

    async activate(params) {
        this.setTemplateParams();
        await this.fetchData(params);
    }

    setTemplateParams() {
        this.ctaButtonLabel = 'Save';
        this.isEdit = true;
    }

    async fetchData(params) {
        const user = await this._user.getUser(params.userId);
        this.user = user;
        this.user.projectId = user.project._id;
        this.user.position = user.position;
        this.user.submit = this.save.bind(this);

        await this.fetchProjectRoles(this.user.projectId);
    }

    async delete() {
        await this._user.deleteUser(this.user._id);
        this.router.navigateBack();
    }

}
