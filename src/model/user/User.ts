export class User {
    userId: string
    login: string
    name: string

    constructor(userId: string, login: string, name: string = "") {
        this.userId = userId
        this.login = login
        this.name = name
    }
}