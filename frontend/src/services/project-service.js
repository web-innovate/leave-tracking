import { inject } from 'aurelia-framework';
import { ApiService } from './api-service';
import { UserModel } from '~/models/user-model';

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

    getProject(id) {
        return this.http.get(`projects/${id}`);
    }

    getUsers(projectId) {
        return this.http.get(`projects/${projectId}/users`)
            .then(res => res.map(x => new UserModel(x)));
    }

    deleteProject(id) {
        return this.http.delete(`projects/${id}`);
    }

    updateProject(project) {
        return this.http.put(`projects/${project._id}`, project);
    }

    queryInfo() {
        return this.http.get(`projects/queryInfo`);
    }
}
