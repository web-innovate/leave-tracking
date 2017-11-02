import { inject } from 'aurelia-framework';
import { Router } from 'aurelia-router';
import { UserService } from '~/services/user-service'
import { ProjectService } from '~/services/project-service'

@inject(UserService, ProjectService, Router)
export class ManageProjectRoles {
    constructor(_user, _project, _dialog, router) {
        this._user = _user;
        this._project = _project;
    }

    configureRouter(config, router){
        config.map([
            {
                route: [''],
                name: 'view-project-roles',
                moduleId: './view-project-roles',
                nav: true,
                title:'Manage project roles',
                settings: {
                    icon: 'time'
                },
                auth: true
            },
            {
                route: ['/:projectRoleId/edit'],
                name: 'edit-project-role',
                moduleId: './edit-project-role',
                nav: false,
                title:'Edit project role',
                settings: {
                    icon: 'time'
                },
                auth: true
            },
            {
                route: ['/create'],
                name: 'create-project-role',
                moduleId: './create-project-role',
                nav: false,
                title:'Create project role',
                settings: {
                    icon: 'time'
                },
                auth: true
            }
        ]);

        config.mapUnknownRoutes('./404.html');
    }
}
