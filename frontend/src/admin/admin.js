import { inject, bindable } from 'aurelia-framework';
import { DialogService } from 'aurelia-dialog';
import { Router } from 'aurelia-router';
import { CreateProject } from './projects/create-project';
import { ManageProjects } from './projects/manage-projects';
import { UserService } from '~/services/user-service';
import { ProjectService } from '~/services/project-service';

@inject(DialogService, UserService, ProjectService, Router)
export class Admin {
    constructor(dialogService, _user, _project, router) {
        this.dialogService = dialogService;
        this._user = _user;
        this._project = _project;
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
                    this._project.updateProject(response.output)
                    console.log('update project', response.output)
                } else {
                    console.log('do not create project')
                }
            })
    }

    configureRouter(config, router) {
        config.map([
             {
                route: [''],
                name: 'admin',
                moduleId: './dash',
                nav: true,
                title:'Admin',
                settings: {
                    icon: 'time'
                },
                auth: true
            },
           {
                route: ['users'],
                name: 'users',
                moduleId: './manage/users/manage-users',
                nav: true,
                title:'Manage Users',
                settings: {
                    icon: 'time'
                },
                auth: true
            }
        ]);
    }
}
