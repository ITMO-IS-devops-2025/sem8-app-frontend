type Result = {
    value: string | null;
};

type Mark = {
    id: string;
    timestamp: Date;
    result: Result;
    comment : string;
};

type Tag = {
    id: string;
    name: string
};

export type Periodicity = {
    type : string,
    value : number
};

export class Habit {
    habitId : string
    name: string
    description : string
    tags : Tag[]
    periodicity: Periodicity
    goal: string
    isTemplated : boolean
    resultType: string
    marks?: Mark[];

    constructor(habitId : string, name: string, periodicity: Periodicity, tags: Tag[], description : string, goal: string, resultType: string, isTemplated : boolean, marks: Mark[] = []) {
        this.habitId = habitId
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