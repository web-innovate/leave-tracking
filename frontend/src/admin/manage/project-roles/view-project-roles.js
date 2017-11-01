import {inject} from 'aurelia-framework';
import { ProjectRoleService } from '~/services/project-role-service';

@inject(ProjectRoleService)
export class ViewProjectRoles {
    loading = true;
    constructor(_project) {
        this._project = _project;
    }

    async attached() {
        const projects = await this._project.getProjects();

        this.projects = projects;
        this.loading = false;
    }
}
