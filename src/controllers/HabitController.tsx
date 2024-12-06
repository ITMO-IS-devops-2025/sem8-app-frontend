import {BaseController} from "../controllers/BaseController";
import {Habit} from "../model/habit/Habit";
import {HabitTemplate} from "../model/habit/HabitTemplate";
import {Habits} from "@/model/habit/Habits";

export class HabitController extends BaseController {
    async getHabitTemplates(){
        let url = "habits/templates";
        return await this.api<HabitTemplate[]>(url);
        /*return [
            new HabitTemplate("5", "Прес качат", "День", "1000 раз", "Галочка"),
            new HabitTemplate("6", "Книга читат", "Неделя", "100 книг", "Число")
        ];*/
    }
    async getHabits(){
        let url = "habits";
        return await this.api<Habits>(url);
        /*return {
            habits: [
                new Habit("7", "Прес качат", "День", "1000 раз", "Галочка"),
                new Habit("8", "Книга читат", "Неделя", "100 книг", "Число")
            ]
        };*/
    }

    async getHabitById(id : string){
        let url = "habits/" + id;
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
        let url = "habits/templated-habits";
        return await this.api<Habit>(url, {"templateId" : templateId}, "POST");
        /*return { habitId : "10" };*/
    }

    async createHabit( name : string, description : string, periodicity : string, goal : string, resultType : string){
        let url = "habits";
        return await this.api<Habit>(url, {"name" : name, "description" : description, "periodicity" : periodicity, "goal" : goal, "resultType" : resultType }, "POST");
        /*return { habitId : "10" };*/
    }

    async changeHabitMark (habitId : string, markId : string, value : string){
        let url = "habits/" + habitId + "/marks/" + markId + "/result";
        return await this.api<any>(url, {"value" : value}, "PUT");
        /*return {};*/
    }

    async changeHabitParameters ( habitId : string, name : string, description : string, periodicity : string, goal : string, resultType : string){
        let url = "habits/" + habitId + "parameters";
        return await this.api<any>(url, {"name" : name, "description" : description, "periodicity" : periodicity, "goal" : goal, "resultType" : resultType }, "PUT");
        /*return {};*/
    }



}
