export class HabitTemplate {
    templateId : string
    name: string
    periodicity: string
    description : string
    goal: string
    resultType: string

    constructor(templateId : string, name: string, periodicity: string, description : string,  goal: string, resultType: string) {
        this.templateId = templateId
        this.name = name
        this.periodicity = periodicity
        this.description = description
        this.goal = goal
        this.resultType = resultType
    }
}