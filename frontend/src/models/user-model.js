import md5 from 'md5';

export class UserModel {
    constructor(data) {
        Object.assign(this, data);
    }

     hello() {
        return this.name + ' | ' + this.id;
    }

    get avatar() {
        const emailHash = md5(this.email.toLowerCase());
        return `https://www.gravatar.com/avatar/${emailHash}?s=300`;
    }
}
