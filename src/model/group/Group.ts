import {Habit} from "../habit/Habit";

export class Group {
    id: number
    name: string
    habits: Habit[]

    constructor(id: number, name: string, habits: Habit[]) {
        this.id = id
        this.name = name
        this.habits = habits
    }
}