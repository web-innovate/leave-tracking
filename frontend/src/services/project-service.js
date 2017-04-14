import { inject } from 'aurelia-framework';
import { ApiService } from './api-service';

@inject(ApiService)
export class ProjectService {

    constructor(api) {
        this.http = api.http;
    }

    createProject(project) {
        return this.http.post('projects', project);
    }

    getProjects() {
        return this.http.get('projects');
    }

    updateProject(project) {
        return this.http.put(`projects/${project._id}`, project);
    }
}
