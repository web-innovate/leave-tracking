import {inject} from 'aurelia-framework';
import { ProjectService } from '~/services/project-service';
import { UserService } from '~/services/user-service';

@inject(ProjectService, UserService)
export class ViewUsers {
    loading = true;
    constructor(_project, _user) {
        this._project = _project;
        this._user = _user;
    }

    async attached() {
        const users = await this._user.getUsers();

        users.forEach(async user => {
            const project = await this._project.getProject(user.projectId);
            user.project = project.name;
        });

        this.users = users;
        this.loading = false;
    }

}
