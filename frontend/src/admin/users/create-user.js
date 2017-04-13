import {inject} from 'aurelia-framework';
import {DialogController} from 'aurelia-dialog';

@inject(DialogController)
export class CreateUser {
    user = {
            firstName: '',
            lastName: '',
            email: '',
            password: '',
            position: '',
            holidays: 0
        };

    constructor(dialogCtrl) {
        this.dialogCtrl = dialogCtrl;
        console.log(dialogCtrl)
    }

    ok(res) {
        this.dialogCtrl.ok(res);
    }

    cancel() {
        this.dialogCtrl.cancel();
    }

}