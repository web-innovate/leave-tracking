import { inject } from 'aurelia-framework';
import { UserService } from '~/services/user-service';
import { ProjectService } from '~/services/project-service';

@inject(UserService, ProjectService)
export class Reports {

    userIds = [];
    results = [];
    userQuery = {};
    projectQuery = {};

    constructor(_user, _project) {
        this._user = _user;
        this._project = _project;
        this.model = this;
    }

    async attached() {
        this.userInfo = await this._user.queryInfo();
        this.projectInfo = await this._project.queryInfo();
    }

    get userQueryJson() {
        return JSON.stringify(this.userQuery)
    }

    get projectQueryJson() {
        return JSON.stringify(this.projectQuery)
    }


    userSource = function(query, limit) {
        return this._userService.searchApproverUserByName(query, limit, 'APPROVER');
    }.bind(this);
}
