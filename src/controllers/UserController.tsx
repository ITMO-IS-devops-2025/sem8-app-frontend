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


    async changeUserPassword(id: string, prevPassword : string, newPassword : string) {
        let url = "users/" + id + "/password";
        return await this.api<User>(url, {prevPassword : prevPassword, newPassword : newPassword});
    }

    async getUserByLogin(login: string) {
        let url = "users/" + login;
        return await this.api<User>(url, {login : login});
        /*return new User ("1", "Игорь")*/
    }

    async getUsers (){
        let url = "users/";
        return await this.api<User[]>(url);
    }

}
