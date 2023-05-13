import IInbox from "../interfaces/Inbox"

interface detailProps {
    inbox: IInbox
}

function InboxDetails({ inbox }: detailProps) {
    const updatedDate = new Date(inbox.updatedAt).toLocaleDateString();

    return (
        <div className="inbox-details">
            <h4>{inbox.space_name}</h4>
            <p><strong>Text: </strong>{inbox.space_text}</p>
            <p><strong>Deleting In: </strong>{inbox.removal}</p>
            <p>{updatedDate}</p>
        </div>
    );
}

export default InboxDetails