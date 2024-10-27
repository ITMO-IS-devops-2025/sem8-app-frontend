import {BaseController} from "./BaseController";
import {User} from "../model/user/User";

export class UserController extends BaseController{

    // это по токену. не делаем токены -- не используем эту функцию
    async getCurrentUser() {
        return await this.api<User>("current-user")
    }
    async getUsers() {
        return await this.api<User[]>("users")
    }

    async getById(id: number) {
        let url = "user?id=" + id
        return await this.api<User>(url)
    }

    // когда ничего не нужно будет выдавать пишем any. с ошибками будем работать плохо потому что это мвп. лучше конечно на все выдавать прописанные респонсы
    async changeName(name: string) {
        return await this.api<any>("change-name", name)
    }
}
