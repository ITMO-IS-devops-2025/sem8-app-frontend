import {BaseController} from "./BaseController";
import {User} from "../model/user/User";
import {Habits} from "../model/habit/Habits";
import {Habit, Periodicity} from "../model/habit/Habit";
import {HabitTemplate} from "../model/habit/HabitTemplate";
import {Statistic} from "@/model/habit/Statistics";

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

    async getUserByLogin(login: string) {
        let url = "users?login=" + login;
        return await this.api<User>(url);
    }

    async getHabits(){
        let url = "users/habits";
        return await this.api<Habits[]>(url);
    }

    async getHabitById(id : string){
        let url = "users/habits/" + id;
        return await this.api<Habit>(url);
        /*return new Habit(
            "7",
            "Прес качат",
            "День",
            "1000 раз",
            "Float",
            [
                { id: "11", timestamp: new Date("2024-11-01T08:00:00"), result: { value: null } },
                { id: "12", timestamp: new Date("2024-11-02T08:00:00"), result: { value: null } }
            ]
        );*/
    }

    async createHabitFromTemplate(templateId : string){
        let url = "users/habits?templateId=" + templateId;
        return await this.api<HabitTemplate>(url, "POST");
        /*return { habitId : "10" };*/
    }

    async createHabit( name : string, description : string, tags : string[], periodicity : Periodicity, goal : string, resultType : string){
        let url = "users/habits";
        return await this.api<Habit>(url, {"name" : name, "description" : description, "tags": tags, "periodicity" : periodicity, "goal" : goal, "resultType" : resultType }, "POST");
        /*return { habitId : "10" };*/
    }

    async getStatistics( habitId : string){
        let url = "users/habits" + habitId + "statistics";
        return await this.api<Statistic>(url);
    }


    async changeUserPassword(id: string, prevPassword : string, newPassword : string) {
        let url = "users/" + id + "/password";
        return await this.api<User>(url, {prevPassword : prevPassword, newPassword : newPassword});
    }

    async getUsers (){
        let url = "users/";
        return await this.api<User[]>(url);
    }

}
