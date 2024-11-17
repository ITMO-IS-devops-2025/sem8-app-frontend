export class HabitTemplate {
    id : string
    name: string
    periodicity: string
    goal: string
    resultType: string

    constructor(id : string, name: string, periodicity: string, goal: string, resultType: string) {
        this.id = id
        this.name = name
        this.periodicity = periodicity
        this.goal = goal
        this.resultType = resultType
    }
}