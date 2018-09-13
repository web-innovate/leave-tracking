import md5 from 'md5';

export class UserModel {
    constructor(data) {
        console.log('da0', data)
        Object.assign(this, data);
    }

    get avatar() {
        const emailHash = md5(this.email.toLowerCase());
        return `https://www.gravatar.com/avatar/${emailHash}?s=300`;
    }

    get fullName() {
        return `${this.firstName} ${this.lastName}`;
    }
}
