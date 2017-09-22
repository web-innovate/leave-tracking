import { inject } from 'aurelia-framework';
import { Router } from 'aurelia-router';
import { ProjectService } from '~/services/project-service';
import { UserService } from '~/services/user-service';
import { BaseProject } from './base-project';

@inject(ProjectService, Router, UserService)
export class EditProject extends BaseProject {
    loading = true;

    constructor(_project, router, _user) {
        super();
        this._project = _project;
        this._user = _user;
        this.router = router;
        this.project = {};
    }

    async activate(params) {
        const { projectId } = params;
        const project = await this._project.getProject(projectId);
        const users = await this._project.getUsers(projectId);

        this.project = project;
        this.users = users;
        this.loading = false;
    }

    saveProject() {
        this._project.updateProject(this.project)
            .then(() => this.redirect());
    }

    deleteProject() {
        this._project.deleteProject(this.project._id)
            .then(() => this.redirect());
    }

    redirect() {
        this.router.navigateToRoute('projects');
    }
}
