import {inject} from 'aurelia-framework';
import {DialogController} from 'aurelia-dialog';

@inject(DialogController)
export class CreateProject {
    project = {
        name: '',
        description: ''
    };

    constructor(dialogCtrl) {
        this.dialogCtrl = dialogCtrl;
    }

    ok(res) {
        this.dialogCtrl.ok(res);
    }

    cancel() {
        this.dialogCtrl.cancel();
    }
}
