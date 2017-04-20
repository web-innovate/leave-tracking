import { inject } from 'aurelia-framework';
import { Router } from 'aurelia-router';
import { UserService } from '~/services/user-service';
import { ProjectService } from '~/services/project-service';

@inject(UserService, ProjectService, Router)
export class EditUser {
    constructor(_user, _project, router) {
        this._user = _user;
        this._project = _project;
        this.router = router;
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

    async save() {
        await this._user.saveUser(this.user);
        this.router.navigateBack();
    }

}
