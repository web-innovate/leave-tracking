import { inject } from 'aurelia-framework';
import { UserService } from '~/services/user-service';
import { ProjectService } from '~/services/project-service';
import md5 from 'md5';

@inject(UserService, ProjectService)
export class Profile {
    constructor(_user, _project) {
        this.user = {};
        this.userLoaded = false;
        this._user = _user;
        this._project = _project;

        console.log('md', md5('bogdan.livadariu@gmail.com'))
    }

    async attached() {
        this.user = await this._user.currentUser();
        const { name : projectName } = await this._project.getProject(this.user.projectId);

        this.user.project = projectName;

        console.log('updatedUser', this.user)
        console.log('proj', projectName)



        this.userLoaded = true;
    }
}
