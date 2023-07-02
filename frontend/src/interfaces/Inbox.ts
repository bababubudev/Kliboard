interface IInbox {
    _id: number;
    space_name: string;
    space_text?: string;
    expires_in: Date;
    createdAt: Date;
    updatedAt: Date;
    __v: number;
}

export default IInbox