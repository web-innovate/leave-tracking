import { inject } from 'aurelia-framework';
import { UserService } from '~/services/user-service'
import { ProjectService } from '~/services/project-service'

@inject(UserService, ProjectService)
export class Users {
    constructor(_user, _project) {
        this._user = _user;
        this._project = _project;
    }

    configureRouter(config, router){
        config.map([
            {
                route: [''],
                name: 'view-users',
                moduleId: './view-users',
                nav: true,
                title:'Manage users',
                settings: {
                    icon: 'time'
                },
                auth: true
            },
            {
                route: ['/:userId/edit'],
                name: 'edit-user',
                moduleId: './edit-user',
                nav: false,
                title:'Edit user',
                settings: {
                    icon: 'time'
                },
                auth: true
            },
            {
                route: ['/create-user'],
                name: 'create-user',
                moduleId: './create-user',
                nav: false,
                title:'Create user',
                settings: {
                    icon: 'time'
                },
                auth: true
            }
        ]);
    }
}
