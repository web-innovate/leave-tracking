import { inject, bindable } from 'aurelia-framework';
import { DialogService } from 'aurelia-dialog';
import { UserService } from '../services/user-service';
import { Profile } from '../profile/profile';

@inject(UserService, DialogService)
export class TopNav {
    @bindable router;

  constructor(userService, dialogService) {
    this.user = {};
    this.userService = userService;
    this.dialogService = dialogService;

    this.userService.getUser().then(user => this.user = user);

    // mock auth to logged in state
    this.auth = {
        isLogged: true
        }
    }

    openProfile() {
        return this.dialogService.open({ viewModel: Profile, model: 'Good or Bad?'});
    }
}
