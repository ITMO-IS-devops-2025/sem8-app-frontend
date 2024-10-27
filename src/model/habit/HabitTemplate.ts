export class HabitTemplate {
    name: string
    periodicity: string
    goal: string
    type: string

    constructor(name: string, periodicity: string, goal: string, type: string) {
        this.name = name
        this.periodicity = periodicity
        this.goal = goal
        this.type = type
    }
}