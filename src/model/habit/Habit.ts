type Result = {
    value: string | null;
};

type Mark = {
    id: string;
    timestamp: Date;
    result: Result;
};

export class Habit {
    habitId : string
    name: string
    periodicity: string
    goal: string
    resultType: string
    marks?: Mark[];

    constructor(habitId : string, name: string, periodicity: string, goal: string, resultType: string, marks: Mark[] = []) {
        this.habitId = habitId
        this.name = name
        this.periodicity = periodicity
        this.goal = goal
        this.resultType = resultType
        this.marks = marks
    }
}