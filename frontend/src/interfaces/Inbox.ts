export interface IInbox {
    _id: number;
    space_name: string;
    space_text?: string;
    removal: number;
    createdAt: Date;
    updatedAt: Date;
    __v: number;
}

export const emptyInbox: IInbox = {
    _id: 0,
    space_name: "",
    space_text: "",
    removal: -1,
    createdAt: new Date(),
    updatedAt: new Date(),
    __v: -1,
}
