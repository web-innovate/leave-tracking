import { inject, bindable } from 'aurelia-framework';
import { DialogService } from 'aurelia-dialog';
import { CreateUser } from './users/create-user';
import { UserService } from '../services/user-service';


@inject(DialogService, UserService)
export class Admin {
    constructor(dialogService, _user) {
        this.dialogService = dialogService;
        this._user = _user;


    }

    createUser() {
        return this.dialogService.open({ viewModel: CreateUser, model: 'Good or Bad?'})
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
