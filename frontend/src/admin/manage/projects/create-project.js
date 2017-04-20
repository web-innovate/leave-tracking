import { inject } from 'aurelia-framework';
import { Router } from 'aurelia-router';
import { ProjectService } from '~/services/project-service';

@inject(ProjectService, Router)
export class CreateProject {
    constructor(_project, router) {
        this._project = _project;
        this.router = router;
        this.project = {};
    }

    createProject() {
        this._project.createProject(this.project)
            .then(() => this.router.navigateBack());
    }
}