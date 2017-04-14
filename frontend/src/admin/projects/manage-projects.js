import {inject} from 'aurelia-framework';
import {DialogController} from 'aurelia-dialog';
import { ProjectService } from '../../services/project-service';

@inject(DialogController, ProjectService)
export class ManageProjects {
    selectedProject ={
        name: '',
        description: ''
    };

    constructor(dialogCtrl, _project) {
        this.dialogCtrl = dialogCtrl;
        this._project = _project;
    }

    attached() {
        this._project.getProjects().then(projects => {
            this.projects = JSON.parse(projects.response);
        });
    }

    ok(res) {
        console.log('selected', this.selectedProject)
        this.dialogCtrl.ok(res);
    }

    cancel() {
        this.dialogCtrl.cancel();
    }
}