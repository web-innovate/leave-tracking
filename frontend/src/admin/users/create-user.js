import {inject} from 'aurelia-framework';
import {DialogController} from 'aurelia-dialog';
import { ProjectService } from '../../services/project-service';

@inject(DialogController, ProjectService)
export class CreateUser {
    user = {
            firstName: '',
            lastName: '',
            email: '',
            password: '',
            position: '',
            projectId: 0,
            holidays: 0
        };

    constructor(dialogCtrl, _projects) {
        this.dialogCtrl = dialogCtrl;
        this._projects = _projects;
        console.log(dialogCtrl)
    }

    attached() {
        this._projects.getProjects().then(res => {
            this.projects = JSON.parse(res.response);
        });
    }

    ok(res) {
        this.dialogCtrl.ok(res);
    }

    cancel() {
        this.dialogCtrl.cancel();
    }

}