import { inject } from 'aurelia-framework';
import { Router } from 'aurelia-router';
import { ProjectService } from '~/services/project-service';

@inject(ProjectService, Router)
export class EditProject {
    loading = true;

    constructor(_project, router) {
        this._project = _project;
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
