import {Result} from "./Result";

export class Habit {
    name: string
    periodicity: string
    goal: string
    type: string
    results: Result[]

    constructor(name: string, periodicity: string, goal: string, type: string, results: Result[]) {
        this.name = name
        this.periodicity = periodicity
        this.goal = goal
        this.type = type
        this.results = results
    }
}