import BaseProject from './base-project';

export class EditProject extends BaseProject {
    loading = true;

    async activate(params) {
        const { projectId } = params;
        const project = await this._project.getProject(projectId);
        const users = await this._project.getUsers(projectId);

        this.project = project;
        this.users = users;
        this.project.submit = this.saveProject.bind(this);

        this.setTemplateParams();
    }

    setTemplateParams() {
        this.ctaButtonLabel = 'Save';
        this.isEdit = true;
        this.loading = false;
    }
}
