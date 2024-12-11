import {BaseController} from "../controllers/BaseController";
import {HabitTemplate} from "../model/habit/HabitTemplate";

export class HabitController extends BaseController {
    async getHabitTemplates(){
        let url = "habits/templates";
        return await this.api<HabitTemplate[]>(url);
    }

    async getHabitsTags(){
        let url = "habits/tags";
        return await this.api<{id: string, name: string}[]>(url);
    }

    async getHabitTagById(tagId : string)  {
        let url = "habits/tags/" + tagId;
        return await this.api<string>(url);
    }

    async changeHabitMark (habitId : string, markId : string, value : string, comment : string){
        let url = "habits/" + habitId + "/marks/" + markId + "/result";
        return await this.api<any>(url, {value, comment}, "PUT");
        /*return {};*/
    }

    async changeHabitParameters(
        habitId: string,
        name: string,
        description: string,
        periodicityType: string,
        periodicityValue: number,
        goal: string
    ) {
        // Формирование URL с query-параметрами
        const queryParams = new URLSearchParams({
            name,
            description,
            periodicityType,
            periodicityValue: periodicityValue.toString(),
            goal,
        }).toString();

        const url = `habits/${habitId}/parameters?${queryParams}`;

        // Отправка запроса
        return await this.api<any>(url, {}, "PUT");
    }


}
