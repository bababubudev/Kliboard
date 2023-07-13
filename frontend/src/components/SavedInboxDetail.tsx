import { ChangeEvent, FormEvent, useState } from "react";
import { IInbox } from "../interfaces/Inbox"
import InboxArea from "./InboxArea";

interface IDetails {
    inbox: IInbox;
    on_update: (inbox: IInbox) => void;
}

function SavedInboxDetails({ inbox, on_update }: IDetails) {
    const [text, set_text] = useState<string>(inbox.space_text || "");
    const [removal_time] = useState<Number>(inbox.removal || 0);

    const updatedDate = new Date(inbox.updatedAt).toLocaleDateString();

    async function handle_submit(event: FormEvent<HTMLFormElement>): Promise<void> {
        event.preventDefault();

        try {
            const response = await fetch(`http://localhost:5000/api/inbox/${inbox._id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ space_text: text })
            });

            on_update(await response.json());
        }
        catch (err) {
            console.error(err);
        }
    }

    function handle_change(event: ChangeEvent<HTMLInputElement | HTMLSelectElement>): void {
        if (event.target instanceof HTMLSelectElement) {
            const expiration = new Date();
            expiration.setHours(expiration.getHours() + Number(event.target.value));
            // set_removal_time(expiration);

            return;
        }

        set_text(event.target.value);
    }

    return (
        <InboxArea
            space_name={inbox.space_name}
            current_text={text}
            updated_date={updatedDate}

            handle_change={handle_change}
            handle_submit={handle_submit}
        />
    );
}

export default SavedInboxDetails