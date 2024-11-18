type userId = {
    userId: string;
};


export class Group {
    groupId?: string;
    name: string;
    participants?: userId[];

    constructor(groupId: string | undefined, name: string, participants: userId[] | undefined) {
        this.groupId = groupId;
        this.name = name;
        this.participants = participants;
    }
}