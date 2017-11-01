import { inject } from 'aurelia-framework';
import { ProjectRoleService } from '~/services/project-role-service';
import { UserService } from '~/services/user-service';
import { Router } from 'aurelia-router';
import {
    ValidationRules,
    ValidationControllerFactory,
    validateTrigger
} from 'aurelia-validation';
import { BootstrapFormRenderer } from '~/components/validation/bootstrap-form-renderer';
import { compareObjects, setupValidationControllers } from '~/util/utils';

@inject(ProjectRoleService, UserService, Router, ValidationControllerFactory)
export default class BaseProjectRole {
    constructor(_project, _user, router, controllerFactory) {
        this._project = _project;
        this.router = router;
        this.originalProject = {};

        setupValidationControllers(controllerFactory, BootstrapFormRenderer, this, validateTrigger);
    }

    attached() {
        ValidationRules
            .ensure('name')
                .required()
            .ensure('description')
                .required()
            .on(this.project);
    }

    get canSave() {
        return compareObjects(this.project, this.originalProject);
    }

    activate(model) {
        this.project = model;
        this.originalProject = JSON.parse(JSON.stringify(this.project));
    }

    createProject() {
        this._project.createProject(this.project)
            .then(() => this.redirect());
    }


    saveProject() {
        this._project.updateProject(this.project)
            .then(() => this.redirect());
    }

    deleteProject() {
        this._project.deleteProject(this.project._id)
            .then(() => this.redirect());
    }

    redirect() {
        this.router.navigateToRoute('project-roles');
    }

    submit() {
        return this.controller.validate()
            .then(result => result.valid && this.project.submit());
    }
}
