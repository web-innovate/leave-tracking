import BaseProjectRole from './base-project-role';

export class CreateProjectRole extends BaseProjectRole {
    project = {
        name: '',
        description: ''
    };

    activate() {
        this.setTemplateParams();
        this.project.submit = this.createProject.bind(this);
    }

    setTemplateParams() {
        this.ctaButtonLabel = 'Create project role';
    }
}