export class User {
    _id: string;
    email: string;
    name: string;
    profile_type: string;
    amis: Array<string>;

    constructor(id?: string, email?: string, name?: string, profile_type?: string, amis?: Array<string>) {
        this._id = id;
        this.email = email;
        this.name = name;
        this.profile_type = profile_type;
        this.amis = amis;
    }

    public setEmail(email: string) {
        this.email = email;
    }

    public setName(name: string) {
        this.name = name;
    }

    public setAmis(amis: Array<string>) {
        this.amis = amis;
    }

}