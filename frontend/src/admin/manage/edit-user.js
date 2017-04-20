import { inject } from 'aurelia-framework';
import { UserService } from '../../services/user-service';
import { ProjectService } from '../../services/project-service';

@inject(UserService, ProjectService)
export class EditUser {
    constructor(_user, _project) {
        this._user = _user;
        this._project = _project;
    }

    async activate(params) {
        console.log('the params', params)
        const user = await this._user.getUser(params.userId);
        const projects = await this._project.getProjects();

        console.log('the user', user);
        this.user = user;
        this.projects = projects;
        console.log(projects)
    }

    get canSave() {
        return false
    }

    save() {
        this._user.saveUser(this.user);
    }

}
