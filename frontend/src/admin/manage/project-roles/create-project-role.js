import BaseProjectRole from './base-project-role';

export class CreateProjectRole extends BaseProjectRole {
    projectRole = {
        name: '',
        description: ''
    };

    activate() {
        this.setTemplateParams();
        this.projectRole.submit = this.createProjectRole.bind(this);
    }

    setTemplateParams() {
        this.ctaButtonLabel = 'Create project role';
    }
}