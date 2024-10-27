export class User {
    id: number
    login: string
    name: string

    constructor(id: number, login: string, name: string) {
        this.id = id
        this.login = login
        this.name = name
    }
}