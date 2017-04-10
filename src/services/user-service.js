export class UserService {
    user = {
        name: 'my awesome name',
        place: 'romanica',
        email: 'my@awesome.list',
        avatar: 'http://babyinfoforyou.com/wp-content/uploads/2014/10/avatar-300x300.png',
        department: 'QA/DEV/Lead',
        project: 'Bamboo',
        totalDaysPerYear: 24,
        remaining: 10,
        taken: 14
    };

    getUser() {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve(this.user);
            }, 500)
        });
    }
}
