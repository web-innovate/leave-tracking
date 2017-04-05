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
                title:'Profile'
            }
        ]);

        this.router = router;
    }
}
