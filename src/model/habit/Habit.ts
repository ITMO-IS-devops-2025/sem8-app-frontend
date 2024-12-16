export type Result = {
    value: string | null;
    comment : string;
};

export type Mark = {
    id: string;
    timestamp: Date;
    result: Result;
};

export type Periodicity = {
    type : string,
    value : number
};

export class Habit {
    id : string
    name: string
    description : string
    tags : string[]
    periodicity: Periodicity
    goal: string
    isTemplated : boolean
    resultType: string
    marks?: Mark[];

    constructor(id : string, name: string, periodicity: Periodicity, tags: string[], description : string, goal: string, resultType: string, isTemplated : boolean, marks: Mark[] = []) {
        this.id = id
        this.name = name
        this.description = description
        this.tags = tags
        this.periodicity = periodicity
        this.goal = goal
        this.resultType = resultType
        this.isTemplated = isTemplated
        this.marks = marks
    }
}