import { inject } from 'aurelia-framework';
import { ProjectService } from '~/services/project-service';
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

@inject(ProjectService, ProjectRoleService, UserService, Router, ValidationControllerFactory)
export default class BaseProject {
    constructor(_project, _projectRole, _user, router, controllerFactory) {
        this._project = _project;
        this._projectRole = _projectRole;
        this._user = _user;
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
            .ensure('approvers')
                .satisfies(value => Array.isArray(value) && value.length > 0)
                .withMessage('At least one approver is required')
            .ensure('roles')
                .satisfies(value => Array.isArray(value) && value.length > 0)
                .withMessage('At least one role is required')
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
            .then(() => this.router.navigateToRoute('projects'));
    }

    getUser = function(userId) {
        return this._user.getUser(userId);
    }.bind(this);

    userSource = function(query, limit) {
        return this._user.searchApproverUserByName(query);
    }.bind(this);

    getProjectRole = function(userId) {
        return this._projectRole.getProjectRole(userId);
    }.bind(this);

    projectRoleSource = function(query, limit) {
        return this._projectRole.searchProjectRoleByName(query);
    }.bind(this);

    saveProject() {
        this._project.updateProject(this.project)
            .then(() => this.redirect());
    }

    deleteProject() {
        this._project.deleteProject(this.project._id)
            .then(() => this.redirect());
    }

    redirect() {
        this.router.navigateToRoute('projects');
    }

    submit() {
        return this.controller.validate()
            .then(result => result.valid && this.project.submit());
    }
}
