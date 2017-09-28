import { inject } from 'aurelia-framework';
import { Router } from 'aurelia-router';
import { UserService } from '~/services/user-service';
import { ProjectService } from '~/services/project-service';

@inject(UserService, ProjectService, Router)
export class Admin {
    constructor(_user, _project, router) {
        this._user = _user;
        this._project = _project;
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
            },
            {
                route: ['projects'],
                name: 'projects',
                moduleId: './manage/projects/manage-projects',
                nav: true,
                title:'Manage Projects',
                settings: {
                    icon: 'time'
                },
                auth: true
            },
            {
                route: ['holidays'],
                name: 'holidays',
                moduleId: './manage/legal-holidays/manage-holidays',
                nav: true,
                title:'Manage Holidays',
                settings: {
                    icon: 'time'
                },
                auth: true
            }
        ]);

        config.mapUnknownRoutes('./404.html');
    }
}
