import {BaseController} from "../controllers/BaseController";
import {Group} from "../model/group/Group";
import {Habit, Periodicity} from "../model/habit/Habit";
import {GroupHabitPersonal} from "../model/habit/GroupHabitPersonal";
import {IdResponse} from "@/model/utils/response/IdResponse";
import {Statistic} from "@/model/habit/Statistics";

export class GroupController extends BaseController {
    async getGroups (){
        let url = "groups";
        return await this.api<Group[]>(url);
    }

    async getGroupById (id : string){
        let url = "groups/" + id;
        return await this.api<Group>(url);
        /*return new Group(id, "Пупы", [{userId : "1"}]);*/
    }

    async createGroup (name : string, participants : string[]) {
        let url = "groups";
        return await this.api<IdResponse>(url, {"name" : name, "participants" : participants}, "POST");
    }

    async addUserToGroup (groupId : string, userId : string ) {
        let url = "groups/" + groupId + "/participants/";
        return await this.api<any>(url, {userId : userId}, "POST");
    }

    async LeaveGroup (groupId : string) {
        let url = "groups/" + groupId + "/participants/";
        return await this.api<any>(url, {}, "DELETE");
    }

    async getGroupCommonHabits (id : string){
        let url = "groups/" + id + "/common-habits";
        return await this.api<Habit[]>(url);
    }

    async getGroupPersonalHabits (id : string){
        let url = "groups/" + id + "/personal-habits";
        return await this.api<GroupHabitPersonal[]>(url);
    }

    async getGroupCommonHabitById (groupId : string, habitId : string ){
        let url = "groups/" + groupId + "/common-habits/" + habitId;
        return await this.api<Habit>(url);
    }

    async getGroupPersonalHabitById (groupId : string, habitId : string ){
        let url = "groups/" + groupId + "/personal-habits/" + habitId;
        return await this.api<GroupHabitPersonal>(url);
    }

    async createCommonHabitFromTemplate(id : string, templateId : string){
        let url = "groups/" + id + "/common-habits?templateId=" + templateId;
        return await this.api<Habit>(url, null, "POST");
        /*return { habitId : "10" };*/
    }

    async createCommonHabit(id : string, name : string, description : string, tags : string[], periodicity : Periodicity, goal : string, resultType : string){
        let url = "groups/" + id + "/common-habits";
        return await this.api<Habit>(url, {"name" : name, "description" : description, "tags": tags, "periodicity" : periodicity, "goal" : goal, "resultType" : resultType }, "POST");
        /*return { habitId : "10" };*/
    }

    async createPersonalHabitFromTemplate(id : string, templateId : string){
        let url = "groups/" + id + "/personal-habits?templateId=" + templateId;
        return await this.api<GroupHabitPersonal>(url, null, "POST");
        /*return { habitId : "10" };*/
    }

    async createPersonalHabit(id : string, name : string, description : string, tags : string[], periodicity : Periodicity, goal : string, resultType : string){
        let url = "groups/" + id + "/personal-habits";
        return await this.api<GroupHabitPersonal>(url, {"name" : name, "description" : description, "tags": tags, "periodicity" : periodicity, "goal" : goal, "resultType" : resultType }, "POST");
        /*return { habitId : "10" };*/
    }

    async getCommonHabitStatistics(id : string, habitId : string){
        let url = "groups/" + id + "/common-habits/" + habitId + "statistics";
        return await this.api<Statistic>(url);
    }

    async getPersonalHabitStatistics(id : string, habitId : string){
        let url = "groups/" + id + "/personal-habits/" + habitId + "statistics";
        return await this.api<Statistic>(url);
    }

}