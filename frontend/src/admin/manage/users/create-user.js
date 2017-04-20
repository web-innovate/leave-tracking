import {inject} from 'aurelia-framework';
import {DialogController} from 'aurelia-dialog';
import { ProjectService } from '~/services/project-service';

@inject(DialogController, ProjectService)
export class CreateUser {
    user = {
            firstName: '',
            lastName: '',
            email: '',
            password: '',
            position: '',
            projectId: 0,
            holidays: 0,
            userType: ''
        };

    constructor(dialogCtrl, _projects) {
        this.dialogCtrl = dialogCtrl;
        this._projects = _projects;
    }

    attached() {
        this._projects.getProjects().then(projects => this.projects = projects);
    }
}
