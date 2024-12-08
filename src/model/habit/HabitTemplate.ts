type Tag = {
    id: string;
    name: string
};

export class HabitTemplate {
    templateId : string
    name: string
    description : string
    tags : Tag[]
    periodicity: string
    goal: string
    resultType: string

    constructor(templateId : string, name: string, periodicity: string, tags: Tag[], description : string,  goal: string, resultType: string) {
        this.templateId = templateId
        this.name = name
        this.description = description
        this.tags = tags
        this.periodicity = periodicity
        this.goal = goal
        this.resultType = resultType
    }
}