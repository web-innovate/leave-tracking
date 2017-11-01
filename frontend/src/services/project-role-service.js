import { inject } from 'aurelia-framework';
import { ApiService } from './api-service';
import { UserModel } from '~/models/user-model';

@inject(ApiService)
export class ProjectRoleService {

    constructor(api) {
        this.http = api.http;
    }

    createProjectRole(projectRole) {
        return this.http.post('project-roles', projectRole);
    }

    getProjectRoles() {
        return this.http.get('project-roles');
    }

    getProjectRole(id) {
        return this.http.get(`project-roles/${id}`);
    }

    deleteProjectRole(id) {
        return this.http.delete(`project-roles/${id}`);
    }

    updateProjectRole(projectRole) {
        return this.http.put(`project-roles/${projectRole._id}`, projectRole);
    }
}
