import { inject, bindable } from 'aurelia-framework';
import { DialogService } from 'aurelia-dialog';
import { CreateUser } from './users/create-user';
import { CreateProject } from './projects/create-project';
import { ManageProjects } from './projects/manage-projects';
import { UserService } from '../services/user-service';
import { ProjectService } from '../services/project-service';


@inject(DialogService, UserService, ProjectService)
export class Admin {
    constructor(dialogService, _user, _project) {
        this.dialogService = dialogService;
        this._user = _user;
        this._project = _project;
    }

    createUser() {
        return this.dialogService.open({ viewModel: CreateUser })
            .then(response => {
                if(!response.wasCancelled) {
                    console.log('create user', response.output)
                    this._user.createUser(response.output);
                } else {
                    console.log('do not create user')
                }
            })
    }

    createProject() {
        return this.dialogService.open({ viewModel: CreateProject })
            .then(response => {
                if(!response.wasCancelled) {
                    this._project.createProject(response.output)
                } else {
                    console.log('do not create project')
                }
            })
    }

    manageProjects() {
        return this.dialogService.open({ viewModel: ManageProjects })
            .then(response => {
                if(!response.wasCancelled) {
                    console.log('update project', response.output)
                } else {
                    console.log('do not create project')
                }
            })
    }

    attached() {
        this._user.getUsers().then(users => {
            this.totalUserCount = JSON.parse(users.response).length
        });

        this._project.getProjects().then(projects => {
            this.totalProjectCount = JSON.parse(projects.response).length
        });
    }
}
