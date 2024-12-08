import {BaseController} from "../controllers/BaseController";
import {Habit} from "../model/habit/Habit";
import {HabitTemplate} from "../model/habit/HabitTemplate";
import {Habits} from "@/model/habit/Habits";

type Tag = {
    id: string;
    name: string
};

export class HabitController extends BaseController {
    async getHabitTemplates(){
        let url = "habits/templates";
        return await this.api<HabitTemplate[]>(url);
    }

    async getHabitsTags(){
        let url = "habits/tags";
        return await this.api<Tag[]>(url);
    }

    async getHabitTag(tagId : string)  {
        let url = "habits/tags/" + tagId;
        return await this.api<string>(url);
    }

    async changeHabitMark (habitId : string, markId : string, value : string, comment : string){
        let url = "habits/" + habitId + "/marks/" + markId + "/result";
        return await this.api<any>(url, {value, comment}, "PUT");
        /*return {};*/
    }

    async changeHabitParameters ( habitId : string, name : string, description : string, periodicityType : string, periodicityValue: number, goal : string){
        let url = "habits/" + habitId + "parameters";
        return await this.api<any>(url, {"name" : name, "description" : description, "periodicityType" : periodicityType, "periodicityValue" : periodicityValue,  "goal" : goal}, "PUT");
        /*return {};*/
    }

}
