import {Periodicity} from "../habit/Habit";

export class HabitTemplate {
    id : string
    name: string
    description : string
    tags : string[]
    periodicity: Periodicity
    goal: string
    resultType: string

    constructor(templateId : string, name: string, periodicity: Periodicity, tags: string[], description : string,  goal: string, resultType: string) {
        this.id = templateId
        this.name = name
        this.description = description
        this.tags = tags
        this.periodicity = periodicity
        this.goal = goal
        this.resultType = resultType
    }
}