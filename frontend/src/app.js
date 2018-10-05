import { inject } from 'aurelia-framework';
import { Redirect, Router } from 'aurelia-router';
import { AuthService } from '~/services/auth-service';
import { Events } from '~/services/events';

@inject(AuthService)
export class App {
    constructor(_auth) {
        this._auth = _auth;
    }

    configureRouter(config, router){
        config.title = 'Leave tracker';
        config.addPipelineStep('authorize', AuthorizeStep);
        config.map([
            {
                route: ['','home'],
                name: 'home',
                moduleId: './dash',
                nav: true,
                title:'Home',
                settings: {
                    icon: 'home'
                },
                auth: true
            },
            {
                route: 'reports',
                name: 'reports',
                moduleId: './reports',
                nav: false,
                title:'Reports',
                settings: {
                    icon: 'folder-open'
                },
                requires: ['ADMIN'],
                auth: true
            },
            {
                route: 'calendar',
                name: 'calendar',
                moduleId: './calendar',
                nav: true,
                title:'Calendar',
                settings: {
                    icon: 'calendar'
                },
                auth: true

            },
            {
                route: 'add-request',
                name: 'add-request',
                moduleId: './add-request/add-request',
                nav: true,
                title:'Add request',
                settings: {
                    icon: 'plus'
                },
                auth: true
            },
            {
                route: ['add-request/:requestId/edit'],
                name: 'edit-request',
                moduleId: './add-request/edit-request',
                nav: false,
                title:'Edit request',
                settings: {
                    icon: 'pencil'
                },
                auth: true
            },
            {
                route: 'admin',
                name: 'admin',
                moduleId: './admin/admin',
                nav: false,
                title:'Admin',
                settings: {
                    icon: 'cog'
                },
                auth: true,
                requires: ['ADMIN']
            },
            {
                route: 'approvals',
                name: 'approvals',
                moduleId: './approvals/approvals',
                nav: false,
                title:'Approvals',
                settings: {
                    icon: 'ok'
                },
                auth: true,
                requires: ['ADMIN', 'APPROVER']
            },
            {
                route: 'login',
                name: 'login',
                moduleId: './login/login',
                nav: false,
                title:'Login',
                settings: {
                    icon: 'log-in'
                }
            },
            {
                route: 'recover/:recoverKey?',
                name: 'recover',
                moduleId: './recover-password/recover-password',
                nav: false,
                title:'Recover Password !',
                settings: {
                },
                auth: false
            },
            {
                route: 'profile',
                name: 'profile',
                moduleId: './profile/profile',
                nav: true,
                title:'Profile',
                settings: {
                    icon: 'user'
                },
                auth: true
            },
        ]);

        config.mapUnknownRoutes('404.html');

        this.router = router;
    }
}

@inject(AuthService, Events, Router)
class AuthorizeStep {
    constructor(_auth, _events, router) {
        this._auth = _auth;
        this._events = _events;
        this.router = router;

        this._events.ea.subscribe('no_token', () => {
            const { currentInstruction } = this.router;

            if (!currentInstruction) {
                return;
            }

            if (['login', 'recover'].indexOf(currentInstruction.config.name) === -1) {
                this.router.navigateToRoute('login')
            }
        })
    }

  run(navigationInstruction, next) {
    if (navigationInstruction.getAllInstructions().some(i => i.config.auth)) {
      const isLoggedIn = this._auth.isAuth;

      if (!isLoggedIn) {
        return next.cancel(new Redirect('login'));
      }
    }

    if (navigationInstruction.config.requires) {
        const { requires } = navigationInstruction.config;
        const { userType } = this._auth.localData();

        if (requires.indexOf(userType) === -1) {
            return next.cancel();
        }
    }

    return next();
  }
}
