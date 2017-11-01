import { inject } from 'aurelia-framework';
import { ApiService } from './api-service';
import { UserModel } from '~/models/user-model';

@inject(ApiService)
export class ProjectRoleService {

    constructor(api) {
        this.http = api.http;
    }

    createProjectRole(projectRole) {
        return this.http.post('project-roles', projectRole)
            .then(res => this.toJson(res.response));
    }

    getProjectRoles() {
        return this.http.get('project-roles')
            .then(res => this.toJson(res.response));
    }

    getProjectRole(id) {
        return this.http.get(`project-roles/${id}`)
            .then(res => this.toJson(res.response));
    }

    deleteProjectRole(id) {
        return this.http.delete(`project-roles/${id}`)
            .then(res => this.toJson(res.response));
    }

    updateProjectRole(projectRole) {
        return this.http.put(`project-roles/${projectRole._id}`, projectRole);
    }

    toJson(data) {
        return JSON.parse(data);
    }
}
