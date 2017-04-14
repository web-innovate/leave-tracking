export class App {
    configureRouter(config, router){
        config.title = 'Leave tracker';

        config.map([
            {
                route: ['','home'],
                name: 'home',
                moduleId: './dash',
                nav: true,
                title:'Home',
                settings: {
                    icon: 'time'
                }
            },
            {
                route: 'reports',
                name: 'reports',
                moduleId: './reports',
                nav: true,
                title:'Reports',
                settings: {
                    icon: 'list-alt'
                }
            },
            {
                route: 'calendar',
                name: 'calendar',
                moduleId: './calendar',
                nav: true,
                title:'Calendar',
                settings: {
                    icon: 'list-alt'
                }
            },
            {
                route: 'add-request',
                name: 'add-request',
                moduleId: './add-request/add-request',
                nav: true,
                title:'Add request',
                settings: {
                    icon: 'plus'
                }
            },
            {
                route: 'admin',
                name: 'admin',
                moduleId: './admin/admin',
                nav: true,
                title:'ADMIN',
                settings: {
                    icon: 'plus'
                }
            },
            {
                route: 'login',
                name: 'login',
                moduleId: './login/login',
                nav: true,
                title:'LOGIN',
                settings: {
                    icon: 'plus'
                }
            },
        ]);

        this.router = router;
    }
}
