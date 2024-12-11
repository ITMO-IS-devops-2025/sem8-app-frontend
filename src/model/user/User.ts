export class User {
    id: string
    login: string
    name: string

    constructor(id: string, login: string, name: string = "") {
        this.id = id
        this.login = login
        this.name = name
    }
}