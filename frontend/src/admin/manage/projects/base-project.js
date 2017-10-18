import { inject } from 'aurelia-framework';
import { ProjectService } from '~/services/project-service';
import { UserService } from '~/services/user-service';

@inject(ProjectService, UserService)
export class BaseProject {
    constructor(_project, _user) {
        this._project = _project;
        this._user = _user;
    }

    getUser = function(userId) {
        return this._user.getUser(userId);
    }.bind(this);

    userSource = function(query, limit) {
        return this._user.searchApproverUserByName(query);
    }.bind(this);
}
