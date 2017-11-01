import BaseProjectRole from './base-project-role';

export class EditProjectRole extends BaseProjectRole {
    loading = true;

    async activate(params) {
        const { projectRoleId } = params;
        this.projectRole = await this._projectRole.getProjectRole(projectRoleId);

        this.projectRole.submit = this.saveProjectRole.bind(this);

        this.setTemplateParams();
    }

    setTemplateParams() {
        this.ctaButtonLabel = 'Save';
        this.isEdit = true;
        this.loading = false;
    }
}
