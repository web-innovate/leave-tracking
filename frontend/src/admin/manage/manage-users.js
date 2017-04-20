import { inject } from 'aurelia-framework';
import { UserService } from '../../services/user-service'
import { ProjectService } from '../../services/project-service'
import { DialogService } from 'aurelia-dialog';
import { Router } from 'aurelia-router';
import { CreateUser } from '../users/create-user';


@inject(UserService, ProjectService, DialogService, Router)
export class Users {
    constructor(_user, _project, _dialog, router) {
        this._user = _user;
        this._project = _project;
        this._dialog = _dialog;
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
            }
        ]);
    }

    createUser() {
        return this._dialog.open({ viewModel: CreateUser })
            .then(response => {
                if(!response.wasCancelled) {
                    console.log('create user', response.output)
                    this._user.createUser(response.output);
                } else {
                    console.log('do not create user')
                }
            })
    }
}
