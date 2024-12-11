type UserDto = {
    userId: string;
    name: string;
};


export class Group {
    id: string;
    name: string;
    participants: UserDto[];

    constructor(groupId: string, name: string, participants: UserDto[] = []) {
        this.id = groupId;
        this.name = name;
        this.participants = participants;
    }
}