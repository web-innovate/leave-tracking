import {inject} from 'aurelia-framework';
import { ProjectRoleService } from '~/services/project-role-service';

@inject(ProjectRoleService)
export class ViewProjectRoles {
    loading = true;
    constructor(_projectRole) {
        this._projectRole = _projectRole;
    }

    async attached() {
        this.projectRoles = await this._projectRole.getProjectRoles();
        this.loading = false;
    }
}
