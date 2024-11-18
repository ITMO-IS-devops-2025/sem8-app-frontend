import {BaseController} from "./BaseController";
import {User} from "../model/user/User";

export class UserController extends BaseController {

    // это по токену. не делаем токены -- не используем эту функцию
    async getCurrentUser() {
        return await this.api<User>("current-user")
    }

    async getUserById(id: string) {
        let url = "users/" + id;
        return await this.api<User>(url);
        /*return new User ("1", "Игорь")*/
    }
}
