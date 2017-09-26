export class ManageHolidays {
    configureRouter(config, router){
        config.map([
            {
                route: [''],
                name: 'view-holidays',
                moduleId: './view-holidays',
                nav: true,
                title:'Manage holiday',
                settings: {
                    icon: 'time'
                },
                auth: true
            },
            {
                route: ['/:holidayId/edit'],
                name: 'edit-holiday',
                moduleId: './edit-holiday',
                nav: false,
                title:'Edit holiday',
                settings: {
                    icon: 'time'
                },
                auth: true
            },
            {
                route: ['/create'],
                name: 'create-holiday',
                moduleId: './create-holiday',
                nav: false,
                title:'Create holiday',
                settings: {
                    icon: 'time'
                },
                auth: true
            }
        ]);

        config.mapUnknownRoutes('./404.html');
    }
}