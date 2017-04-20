import { inject } from 'aurelia-framework';
import { Router } from 'aurelia-router';
import { UserService } from '~/services/user-service'
import { ProjectService } from '~/services/project-service'

@inject(UserService, ProjectService, Router)
export class ManageProjects {
    constructor(_user, _project, _dialog, router) {
        this._user = _user;
        this._project = _project;
    }

    configureRouter(config, router){
        config.map([
            {
                route: [''],
                name: 'view-projects',
                moduleId: './view-projects',
                nav: true,
                title:'Manage projects',
                settings: {
                    icon: 'time'
                },
                auth: true
            },
            {
                route: ['/:projectId/edit'],
                name: 'edit-project',
                moduleId: './edit-project',
                nav: false,
                title:'Edit project',
                settings: {
                    icon: 'time'
                },
                auth: true
            },
            {
                route: ['/create'],
                name: 'create-project',
                moduleId: './create-project',
                nav: false,
                title:'Create project',
                settings: {
                    icon: 'time'
                },
                auth: true
            }
        ]);
    }
}
