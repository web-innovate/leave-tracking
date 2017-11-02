import { inject } from 'aurelia-framework';
import { ProjectRoleService } from '~/services/project-role-service';
import { Router } from 'aurelia-router';
import {
    ValidationRules,
    ValidationControllerFactory,
    validateTrigger
} from 'aurelia-validation';
import { BootstrapFormRenderer } from '~/components/validation/bootstrap-form-renderer';
import { compareObjects, setupValidationControllers } from '~/util/utils';

@inject(ProjectRoleService, Router, ValidationControllerFactory)
export default class BaseProjectRole {
    constructor(_projectRole, router, controllerFactory) {
        this._projectRole = _projectRole;
        this.router = router;
        this.originalProjectRole = {};

        setupValidationControllers(controllerFactory, BootstrapFormRenderer, this, validateTrigger);
    }

    attached() {
        ValidationRules
            .ensure('name')
                .required()
            .ensure('description')
                .required()
            .on(this.projectRole);
    }

    get canSave() {
        return compareObjects(this.projectRole, this.originalProjectRole);
    }

    activate(model) {
        this.projectRole = model;
        this.originalProjectRole = JSON.parse(JSON.stringify(this.projectRole));
    }

    createProjectRole() {
        this._projectRole.createProjectRole(this.projectRole)
            .then(() => this.redirect());
    }


    saveProjectRole() {
        this._projectRole.updateProjectRole(this.projectRole)
            .then(() => this.redirect());
    }

    deleteProjectRole() {
        this._projectRole.deleteProjectRole(this.projectRole._id)
            .then(() => this.redirect());
    }

    redirect() {
        this.router.navigateToRoute('project-roles');
    }

    submit() {
        return this.controller.validate()
            .then(result => result.valid && this.projectRole.submit());
    }
}
