import {BaseController} from "../controllers/BaseController";
import {Group} from "../model/group/Group";

export class GroupController extends BaseController {
    async getGroups (){
        let url = "groups";
        return await this.api<Group[]>(url);
        /*return [
            new Group("3", "Лупы", [{userId : "1"}]),
            new Group("4", "Пупы", [{userId : "1"}])
        ];*/
    }

    async getGroupById (id : string){
        let url = "groups/" + id;
        return await this.api<Group>(url);
        /*return new Group(id, "Пупы", [{userId : "1"}]);*/
    }

    async createGroup (name : string) {
        let url = "groups";
        return await this.api<Group>(url, {"name" : name}, "POST");
        /*return new Group("5", name, [{userId : "1"}]);*/
    }

    async addUserToGroup (groupId : string, userId : string ) {
        let url = "groups/" + groupId + "/participants/" + userId;
        return await this.api<Group>(url, {groupId : groupId, userId : userId}, "PUT");
    }

    async RemoveUserFromGroup (groupId : string, userId : string ) {
        let url = "groups/" + groupId + "/participants/" + userId;
        return await this.api<Group>(url, {groupId : groupId, userId : userId}, "DELETE");
    }


    async getGroupHabits (id : string){
        let url = "groups" + id + "/habits";
        return await this.api<Group[]>(url);
    }

    async getGroupHabitById (groupId : string, userId : string ){
        let url = "groups" + groupId + "/habits" + userId;
        return await this.api<Group[]>(url);
    }

}