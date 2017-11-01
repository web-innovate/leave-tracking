import { inject } from 'aurelia-framework';
import { ApiService } from './api-service';
import { UserModel } from '~/models/user-model';

@inject(ApiService)
export class ProjectRoleService {

    constructor(api) {
        this.http = api.http;
    }

    createProject(project) {
        return this.http.post('project-roles', project)
            .then(res => this.toJson(res.response));
    }

    getProjects() {
        return this.http.get('project-roles')
            .then(res => this.toJson(res.response));
    }

    getProject(id) {
        return this.http.get(`project-roles/${id}`)
            .then(res => this.toJson(res.response));
    }

    deleteProject(id) {
        return this.http.delete(`project-roles/${id}`)
            .then(res => this.toJson(res.response));
    }

    updateProject(project) {
        return this.http.put(`project-roles/${project._id}`, project);
    }

    toJson(data) {
        return JSON.parse(data);
    }
}
