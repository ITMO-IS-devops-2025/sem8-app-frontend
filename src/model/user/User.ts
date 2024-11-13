export class User {
    id?: string
    login: string

    constructor(id: string | undefined, login: string) {
        this.id = id
        this.login = login
    }
}