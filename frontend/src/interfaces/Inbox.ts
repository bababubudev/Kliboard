export interface IInbox {
    space_name: string;
    space_text?: string;
    removal: number;
    createdAt: Date;
    updatedAt: Date;
}

export const emptyInbox: IInbox = {
    space_name: "",
    space_text: "",
    removal: -1,
    createdAt: new Date(),
    updatedAt: new Date(),
}
