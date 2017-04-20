import {inject} from 'aurelia-framework';
import { ProjectService } from '~/services/project-service';

@inject(ProjectService)
export class ViewProjects {
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
