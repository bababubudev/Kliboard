import { ChangeEvent, FormEvent, useState } from "react";
import { IInbox, emptyInbox } from "../interfaces/Inbox"
import InboxArea from "./InboxArea";

interface IDetails {
    inbox: IInbox;
    on_update: (inbox: IInbox) => void;
}

function SavedInboxDetails({ inbox, on_update }: IDetails) {
    const [text, set_text] = useState<string>(inbox.space_text || "");
    const [removal_time] = useState<Number>(inbox.removal || 0);

    const updatedDate = new Date(inbox.updatedAt).toLocaleDateString();

    const content = {
        space_text: text,
        removal: removal_time
    }

    async function handle_submit(event: FormEvent<HTMLFormElement>): Promise<void> {
        event.preventDefault();

        const response = await fetch(`http://localhost:5000/api/inbox/${inbox._id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(content)
        });

        try {
            const endData = await response.json();

            on_update(endData ? endData : emptyInbox);
        }
        catch (err) {
            console.error(err);
        }
    }

    function handle_change(event: ChangeEvent<HTMLInputElement>): void {
        set_text(event.target.value);
    }

    return (
        <InboxArea
            space_name={inbox.space_name}
            current_text={text}
            updated_date={updatedDate}

            handle_submit={handle_submit}
            handle_change={handle_change}
        />
    );
}

export default SavedInboxDetails