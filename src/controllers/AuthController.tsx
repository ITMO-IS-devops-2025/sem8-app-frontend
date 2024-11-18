import {SignInRequest} from "../model/user/auth/SignInRequest";
import {SignUpRequest} from "../model/user/auth/SignUpRequest";
import {BaseController} from "./BaseController";
import {AuthResponse} from "../model/user/auth/AuthResponse";

export class AuthController extends BaseController {
    async signUp(user: SignUpRequest) {
        return await this.api<AuthResponse>("register", user, "POST")
    }

    async signIn(user: SignInRequest) {
        return await this.api<AuthResponse>("login", user, "POST")
    }

    async signOut(){
        return await this.api<null>("logout", null, "POST")
    }
}