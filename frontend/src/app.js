import { inject } from 'aurelia-framework';
import { Redirect, Router } from 'aurelia-router';
import { AuthService } from './services/auth-service';
import { Events } from './services/events';

export class App {
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
                    icon: 'time'
                },
                auth: true
            },
            {
                route: 'reports',
                name: 'reports',
                moduleId: './reports',
                nav: true,
                title:'Reports',
                settings: {
                    icon: 'list-alt'
                },
                auth: true
            },
            {
                route: 'calendar',
                name: 'calendar',
                moduleId: './calendar',
                nav: true,
                title:'Calendar',
                settings: {
                    icon: 'list-alt'
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
                route: 'admin',
                name: 'admin',
                moduleId: './admin/admin',
                nav: true,
                title:'Admin',
                settings: {
                    icon: 'plus'
                },
                auth: true
            },
            {
                route: 'login',
                name: 'login',
                moduleId: './login/login',
                nav: false,
                title:'Login',
                settings: {
                }
            },
        ]);

        this.router = router;
    }
}

@inject(AuthService, Events, Router)
class AuthorizeStep {
    constructor(_auth, _events, router) {
        this._auth = _auth;
        this._events = _events;
        this.router = router;

        this._events.ea.subscribe('no_token', (rr) => {
            this.router.navigateToRoute('login')
        })
    }

  run(navigationInstruction, next) {
    if (navigationInstruction.getAllInstructions().some(i => i.config.auth)) {
      var isLoggedIn = this._auth.isAuth;
      if (!isLoggedIn) {
        return next.cancel(new Redirect('login'));
      }
    }

    return next();
  }
}
