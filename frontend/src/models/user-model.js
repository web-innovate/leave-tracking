export class UserModel {
    constructor(data) {
        Object.assign(this, data);
    }

     hello() {
        return this.name + ' | ' + this.id;
    }
}