type UserDto = {
    userId: string;
    name: string;
};


export class Group {
    groupId?: string;
    name: string;
    participants: UserDto[];

    constructor(groupId: string | undefined, name: string, participants: UserDto[] = []) {
        this.groupId = groupId;
        this.name = name;
        this.participants = participants;
    }
}