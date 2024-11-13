import {Habit} from "../habit/Habit";

type userId = {
    userId: string;
};


export class Group {
    id?: string;
    name: string;
    participants?: userId[];

    constructor(id: string | undefined, name: string, participants: userId[] | undefined) {
        this.id = id;
        this.name = name;
        this.participants = participants;
    }
}