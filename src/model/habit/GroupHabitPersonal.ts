type Result = {
    value: string | null;
};

type Mark = {
    timestamp: Date;
    personalMarks : PersonalMarks[];
};

type PersonalMarks = {
    id: string;
    userId : string;
    result: Result;
    comment : string;
}

type Tag = {
    id: string;
    name: string;
};

type Periodicity = {
    type : string;
    value : number;
};

export class GroupHabitPersonal {
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