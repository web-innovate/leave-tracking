import { inject } from 'aurelia-framework';
import { Router } from 'aurelia-router';
import { UserService } from '~/services/user-service';
import { ProjectService } from '~/services/project-service';
import { ProjectRoleService } from '~/services/project-role-service';
import {
    ValidationRules,
    ValidationControllerFactory,
    validateTrigger
} from 'aurelia-validation';
import { BootstrapFormRenderer } from '~/components/validation/bootstrap-form-renderer';
import { compareObjects, setupValidationControllers } from '~/util/utils';
import { MultiObserver } from '~/util/multi-observer';

let attachObserver = true;

@inject(UserService, ProjectService, ProjectRoleService, Router, ValidationControllerFactory, MultiObserver)
export default class BaseUser {
    constructor(_user, _project, _projectRole, router, controllerFactory, _observe) {
        this._user = _user;
        this._project = _project;
        this._projectRole = _projectRole;
        this.router = router;
        this._observe = _observe;
        this.originalUser = {};

        setupValidationControllers(controllerFactory, BootstrapFormRenderer, this, validateTrigger);
    }

    attached() {
        ValidationRules
            .ensure('firstName').required()
            .ensure('lastName').required()
            .ensure('email').required().email()
            .ensure('password').required().minLength(5)
            .ensure('daysPerYear').satisfiesRule('integerRange', 0, 500)
            .ensure('holidays').satisfiesRule('integerRange', 0, 500)
            .ensure('position').required().satisfiesRule('otherThan', 'None')
            .ensure('userType').required().satisfiesRule('otherThan', 'None')
            .ensure('projectId').required().satisfiesRule('otherThan', 'None')
            .on(this.user);

        if (attachObserver) {
            attachObserver = false;
            this._observe.observe([
                    [this.user, 'projectId']
                ],
                projectId => this.fetchProjectRoles(projectId));
        }
    }

    unbind() {
        attachObserver = true;
    }

    get canSave() {
        return compareObjects(this.user, this.originalUser);
    }

    async activate(model) {
        this.user = model;
        this.originalUser = JSON.parse(JSON.stringify(this.user));

        await this.fetchProjectsData();
    }

    async fetchData(params) {
        await this.fetchProjectsData();
    }

    async fetchProjectsData() {
        const projects = await this._project.getProjects();
        this.projects = projects;
    }

    async save() {
        await this._user.saveUser(this.user);
        this.router.navigateBack();
    }

    async create() {
        await this._user.createUser(this.user);
        this.router.navigateToRoute('users');
    }

    async delete() {
        await this._user.deleteUser(this.user._id);
        this.router.navigateBack();
    }

    submit() {
        return this.controller.validate()
            .then(result => result.valid && this.user.submit());
    }

    async fetchProjectRoles(projectId) {
        if (projectId === 'None') {
            return [];
        }
        const { roles }  = await this._project.getProject(projectId);

        const dataRoles = await
            Promise.all(roles.map(async role => this._projectRole.getProjectRole(role)));

        this.roles = dataRoles;
    }
}
