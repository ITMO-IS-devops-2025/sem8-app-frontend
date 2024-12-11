import {User} from "@/model/user/User";

export class Group {
    id: string;
    name: string;
    participants: User[];

    constructor(groupId: string, name: string, participants: User[] = []) {
        this.id = groupId;
        this.name = name;
        this.participants = participants;
    }
}