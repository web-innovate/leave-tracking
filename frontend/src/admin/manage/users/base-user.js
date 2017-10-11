import { inject } from 'aurelia-framework';
import { Router } from 'aurelia-router';
import { UserService } from '~/services/user-service';
import { ProjectService } from '~/services/project-service';

@inject(UserService, ProjectService, Router)
export default class BaseUser {

    constructor(_user, _project, router) {
        this._user = _user;
        this._project = _project;
        this.router = router;
    }

    async activate(params) {
        await this.fetchProjectsData();
    }

    async fetchData(params) {
        await this.fetchProjectsData();
    }

    async fetchProjectsData() {
        const projects = await this._project.getProjects();
        this.projects = projects;
    }

    async save() {
        await this._user.saveUser(this.user);
        this.router.navigateBack();
    }

    async create() {
        await this._user.createUser(this.user);
        this.router.navigateBack();
    }

    async delete() {
        await this._user.deleteUser(this.user._id);
        this.router.navigateBack();
    }
}
