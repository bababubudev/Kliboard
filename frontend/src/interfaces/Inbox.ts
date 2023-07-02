export interface IInbox {
    _id: number;
    space_name: string;
    space_text?: string;
    removal: number;
    createdAt: Date;
    updatedAt: Date;
    __v: number;
}

export const emptyInbox = {
    _id: 0,
    space_name: "",
    space_text: "",
    removal: -1,
    createdAt: Date.now(),
    updatedAt: Date.now(),
    __v: -1,
}
