export class App {
    configureRouter(config, router){
        config.title = 'Aurelia';

        config.map([
            {
                route: ['','home'],
                name: 'home',
                moduleId: './dash',
                nav: true,
                title:'Home'
            },
            {
                route: 'profile',
                name: 'about',
                moduleId: './profile',
                nav: true,
                title:'Profile',
                // settings: { requireLogin: true }
            },
            {
                route: 'reports',
                name: 'reports',
                moduleId: './reports',
                nav: true,
                title:'Reports'
            },
            {
                route: 'advanced',
                name: 'advanced',
                moduleId: './advanced',
                nav: true,
                title:'Advanced'
            }
        ]);

        this.router = router;
    }
}
