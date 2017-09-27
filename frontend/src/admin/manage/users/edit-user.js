import { UserService } from '~/services/user-service';
import { ProjectService } from '~/services/project-service';
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
        super.user = user;
    }

    get canSave() {
        return false
    }

    submit() {
        this.save();
    }

}
