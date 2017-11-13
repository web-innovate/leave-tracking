import {inject} from 'aurelia-framework';
import { ProjectService } from '~/services/project-service';
import { ProjectRoleService } from '~/services/project-role-service';
import { UserService } from '~/services/user-service';

@inject(ProjectService, UserService, ProjectRoleService)
export class ViewUsers {
    loading = true;
    constructor(_project, _user, _role) {
        this._project = _project;
        this._user = _user;
        this._role = _role;
    }

    async attached() {
        const users = await this._user.getUsers();

        users.forEach(async user => {
            const project = await this._project.getProject(user.projectId);
            const role = await this._role.getProjectRole(user.position);

            user.project = project.name;
            user.role = role;
        });

        this.users = users;
        this.loading = false;
    }

}
