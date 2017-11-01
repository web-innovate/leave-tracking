import BaseProjectRole from './base-project-role';

export class EditProjectRole extends BaseProjectRole {
    loading = true;

    async activate(params) {
        const { projectRoleId } = params;
        const project = await this._project.getProject(projectRoleId);

        this.project = project;
        this.project.submit = this.saveProject.bind(this);

        this.setTemplateParams();
    }

    setTemplateParams() {
        this.ctaButtonLabel = 'Save';
        this.isEdit = true;
        this.loading = false;
    }
}
