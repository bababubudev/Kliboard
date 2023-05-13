interface IInbox {
    _id: number;
    space_name: string;
    space_text?: string;
    removal: number;
    createdAt: Date;
    updatedAt: Date;
    __v: number;
}

export default IInbox