import { inject } from 'aurelia-framework';
import { Router } from 'aurelia-router';
import { UserService } from '~/services/user-service';
import { ProjectService } from '~/services/project-service';
import {
    ValidationRules,
    ValidationControllerFactory,
    validateTrigger
} from 'aurelia-validation';
import { BootstrapFormRenderer } from '~/components/validation/bootstrap-form-renderer';

@inject(UserService, ProjectService, Router, ValidationControllerFactory)
export default class BaseUser {
    constructor(_user, _project, router, controllerFactory) {
        this._user = _user;
        this._project = _project;
        this.router = router;

        this.setupValidationController(controllerFactory);
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
    }

    setupValidationController(controllerFactory) {
        this.controller = controllerFactory.createForCurrentScope();
        this.controller.validateTrigger = validateTrigger.changeOrBlur;
        this.controller.addRenderer(new BootstrapFormRenderer());
    }

    async activate(model, extra) {
        this.user = model;
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

    validate() {
        this.controller.validate()
            .then(result => {
                if (result.valid) {
                    this.user.submit();
                }
            });
    }
}
