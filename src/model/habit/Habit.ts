type Result = {
    value: string | null;
};

type Mark = {
    id: string;
    timestamp: Date;
    result: Result;
};

export class Habit {
    id : string
    name: string
    periodicity: string
    goal: string
    resultType: string
    marks?: Mark[];

    constructor(id : string, name: string, periodicity: string, goal: string, resultType: string, marks: Mark[] = []) {
        this.id = id
        this.name = name
        this.periodicity = periodicity
        this.goal = goal
        this.resultType = resultType
        this.marks = marks
    }
}