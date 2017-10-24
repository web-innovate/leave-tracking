import BaseProject from './base-project';

export class CreateProject extends BaseProject {
    project = {
        approvers: [],
        description: '',
        name: ''
    };

    activate() {
        this.setTemplateParams();
        this.project.submit = this.createProject.bind(this);
    }

    setTemplateParams() {
        this.ctaButtonLabel = 'Create project';
    }
}