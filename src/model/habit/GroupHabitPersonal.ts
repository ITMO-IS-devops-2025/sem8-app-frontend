import {Periodicity, Result} from "@/model/habit/Habit";

type Mark = {
    timestamp: Date;
    personalMarks : PersonalMarks[];
};

type PersonalMarks = {
    id: string;
    userId : string;
    result: Result;
    comment : string;
};

export class GroupHabitPersonal {
    id : string
    name: string
    description : string
    tags : string[]
    periodicity: Periodicity
    goal: string
    isTemplated : boolean
    resultType: string
    marks?: Mark[];

    constructor(habitId : string, name: string, periodicity: Periodicity, tags: string[], description : string, goal: string, resultType: string, isTemplated : boolean, marks: Mark[] = []) {
        this.id = habitId
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